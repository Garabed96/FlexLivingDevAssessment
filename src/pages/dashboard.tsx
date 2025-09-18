import React from 'react';
import { useGetReviews } from '../api/reviews';
import { type Review } from '@/schemas'; // Import Review type
import { columns } from '@/components/reviews-table/columns';
import { DataTable } from '@/components/reviews-table/data-table.tsx';
import { PropertySidebar } from '@/components/PropertySidebar';
import { DashboardSkeleton } from '@/components/reviews-table/DashboardSkeleton';
import { AlertCircle } from 'lucide-react';

// Define a type for our property summary data
interface PropertySummary {
  name: string;
  averageOverallRating: number | null;
  averageCleanlinessRating: number | null;
  averageCommunicationRating: number | null;
  reviewCount: number;
  overallPerformance: 'good' | 'average' | 'bad';
  trend: 'up' | 'down' | 'stable';
}

// Utility function to calculate property summaries
const getPropertySummaries = (reviews: Review[]): PropertySummary[] => {
  const propertyReviewMap = new Map<string, Review[]>();
  const propertyAggregateMap = new Map<
    string,
    {
      totalOverallRating: number;
      overallCount: number;
      totalCleanlinessRating: number;
      cleanlinessCount: number;
      totalCommunicationRating: number;
      communicationCount: number;
      recentReviewRatings: number[];
    }
  >();

  // Group reviews by property and aggregate initial data
  reviews.forEach((review) => {
    const propertyName = review.listingName;
    if (!propertyReviewMap.has(propertyName)) {
      propertyReviewMap.set(propertyName, []);
      propertyAggregateMap.set(propertyName, {
        totalOverallRating: 0,
        overallCount: 0,
        totalCleanlinessRating: 0,
        cleanlinessCount: 0,
        totalCommunicationRating: 0,
        communicationCount: 0,
        recentReviewRatings: [],
      });
    }

    propertyReviewMap.get(propertyName)!.push(review);
    const aggregate = propertyAggregateMap.get(propertyName)!;

    if (review.rating !== null) {
      aggregate.totalOverallRating += review.rating;
      aggregate.overallCount += 1;
    }

    review.reviewCategory.forEach((cat) => {
      if (cat.category === 'cleanliness') {
        aggregate.totalCleanlinessRating += cat.rating;
        aggregate.cleanlinessCount += 1;
      } else if (cat.category === 'communication') {
        aggregate.totalCommunicationRating += cat.rating;
        aggregate.communicationCount += 1;
      }
    });
  });

  const summaries: PropertySummary[] = [];

  // Calculate averages and trends
  propertyReviewMap.forEach((propReviews, propertyName) => {
    const aggregate = propertyAggregateMap.get(propertyName)!;

    const averageOverallRating =
      aggregate.overallCount > 0
        ? parseFloat(
            (aggregate.totalOverallRating / aggregate.overallCount).toFixed(1),
          )
        : null;

    const averageCleanlinessRating =
      aggregate.cleanlinessCount > 0
        ? parseFloat(
            (
              aggregate.totalCleanlinessRating / aggregate.cleanlinessCount
            ).toFixed(1),
          )
        : null;

    const averageCommunicationRating =
      aggregate.communicationCount > 0
        ? parseFloat(
            (
              aggregate.totalCommunicationRating / aggregate.communicationCount
            ).toFixed(1),
          )
        : null;

    // Determine overall performance
    let overallPerformance: 'good' | 'average' | 'bad' = 'average';
    if (averageOverallRating !== null) {
      if (averageOverallRating >= 8.5) {
        // Good threshold
        overallPerformance = 'good';
      } else if (averageOverallRating <= 6.5) {
        // Bad threshold
        overallPerformance = 'bad';
      }
    }

    // Determine trend based on recent reviews (simplified)
    // Sort reviews by date descending to get recent ones
    const sortedReviews = propReviews.sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime(),
    );
    const recentReviews = sortedReviews.slice(
      0,
      Math.min(3, sortedReviews.length),
    ); // Consider last 3 reviews
    const recentOverallRatingSum = recentReviews.reduce(
      (sum, r) => sum + (r.rating !== null ? r.rating : 0),
      0,
    );
    const recentOverallRatingCount = recentReviews.filter(
      (r) => r.rating !== null,
    ).length;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentOverallRatingCount > 0 && averageOverallRating !== null) {
      const averageRecentRating =
        recentOverallRatingSum / recentOverallRatingCount;
      const TREND_THRESHOLD = 0.5; // Change in average needed to indicate a trend

      if (averageRecentRating > averageOverallRating + TREND_THRESHOLD) {
        trend = 'up';
      } else if (averageRecentRating < averageOverallRating - TREND_THRESHOLD) {
        trend = 'down';
      }
    }

    summaries.push({
      name: propertyName,
      averageOverallRating,
      averageCleanlinessRating,
      averageCommunicationRating,
      reviewCount: aggregate.overallCount,
      overallPerformance,
      trend,
    });
  });

  return summaries.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
};

function DashboardPage() {
  const { data: reviews, isLoading, isError, error } = useGetReviews();
  const [selectedProperty, setSelectedProperty] = React.useState<string | null>(
    null,
  );

  const [performanceFilter, setPerformanceFilter] = React.useState('all');
  const [trendFilter, setTrendFilter] = React.useState('all');
  // --- END: New state ---

  const propertySummaries = React.useMemo(() => {
    if (reviews) {
      return getPropertySummaries(reviews);
    }
    return [];
  }, [reviews]);

  // Memo the filtered summaries based on performance and trend filters
  const filteredSummaries = React.useMemo(() => {
    return propertySummaries.filter((summary) => {
      const performanceMatch =
        performanceFilter === 'all' ||
        summary.overallPerformance === performanceFilter;
      const trendMatch = trendFilter === 'all' || summary.trend === trendFilter;
      return performanceMatch && trendMatch;
    });
  }, [propertySummaries, performanceFilter, trendFilter]);

  // Handle clearing filter if property is no longer in summaries
  React.useEffect(() => {
    if (
      selectedProperty &&
      !filteredSummaries.some((p) => p.name === selectedProperty)
    ) {
      setSelectedProperty(null);
    }
  }, [selectedProperty, filteredSummaries]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#B91C1C',
          backgroundColor: '#FEE2E2',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #FCA5A5',
        }}
      >
        <AlertCircle size={24} />
        <div>
          <h4 style={{ margin: 0, fontWeight: 'bold' }}>
            Error fetching reviews
          </h4>
          <p style={{ margin: 0, fontSize: '0.9em' }}>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Property Sidebar */}
      <PropertySidebar
        summaries={filteredSummaries} // Pass the FILTERED summaries
        selectedProperty={selectedProperty}
        onSelectProperty={setSelectedProperty}
        totalReviews={reviews?.length || 0}
        totalProperties={propertySummaries.length}
        performanceFilter={performanceFilter}
        setPerformanceFilter={setPerformanceFilter}
        trendFilter={trendFilter}
        setTrendFilter={setTrendFilter}
      />

      {/* Main Content Area */}
      {/* This container will now manage its children's layout and scrolling */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reviews Dashboard</h1>
            {reviews ? (
              <DataTable
                columns={columns}
                data={reviews}
                initialFilterProperty={selectedProperty}
              />
            ) : (
              <p>No reviews found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
