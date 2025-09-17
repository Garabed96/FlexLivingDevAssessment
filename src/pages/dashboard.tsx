import React from 'react';
import { useGetReviews } from '../api/reviews';
import { columns } from '@/components/reviews-table/columns';
import { DataTable } from '@/components/reviews-table/data-table.tsx';
import { type Review } from '@/schemas'; // Import Review type

// Define a type for our property summary data
interface PropertySummary {
  name: string;
  averageOverallRating: number | null;
  averageCleanlinessRating: number | null;
  averageCommunicationRating: number | null;
  reviewCount: number;
}

// Utility function to calculate property summaries
const getPropertySummaries = (reviews: Review[]): PropertySummary[] => {
  const propertyMap = new Map<
    string,
    {
      totalOverallRating: number;
      overallCount: number;
      totalCleanlinessRating: number;
      cleanlinessCount: number;
      totalCommunicationRating: number;
      communicationCount: number;
    }
  >();

  reviews.forEach((review) => {
    const propertyName = review.listingName;
    if (!propertyMap.has(propertyName)) {
      propertyMap.set(propertyName, {
        totalOverallRating: 0,
        overallCount: 0,
        totalCleanlinessRating: 0,
        cleanlinessCount: 0,
        totalCommunicationRating: 0,
        communicationCount: 0,
      });
    }
    const summary = propertyMap.get(propertyName)!;

    // Aggregate Overall Rating
    if (review.rating !== null) {
      summary.totalOverallRating += review.rating;
      summary.overallCount += 1;
    }

    // Aggregate Category Ratings
    review.reviewCategory.forEach((cat) => {
      if (cat.category === 'cleanliness') {
        summary.totalCleanlinessRating += cat.rating;
        summary.cleanlinessCount += 1;
      } else if (cat.category === 'communication') {
        summary.totalCommunicationRating += cat.rating;
        summary.communicationCount += 1;
      }
      // Add other categories here if needed
    });
  });

  const summaries: PropertySummary[] = Array.from(propertyMap.entries()).map(
    ([
      name,
      {
        totalOverallRating,
        overallCount,
        totalCleanlinessRating,
        cleanlinessCount,
        totalCommunicationRating,
        communicationCount,
      },
    ]) => ({
      name,
      averageOverallRating:
        overallCount > 0
          ? parseFloat((totalOverallRating / overallCount).toFixed(1))
          : null,
      averageCleanlinessRating:
        cleanlinessCount > 0
          ? parseFloat((totalCleanlinessRating / cleanlinessCount).toFixed(1))
          : null,
      averageCommunicationRating:
        communicationCount > 0
          ? parseFloat(
              (totalCommunicationRating / communicationCount).toFixed(1),
            )
          : null,
      reviewCount: overallCount, // Use overallCount for total reviews
    }),
  );

  return summaries.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
};

function DashboardPage() {
  const { data: reviews, isLoading, isError, error } = useGetReviews();
  const [selectedProperty, setSelectedProperty] = React.useState<string | null>(
    null,
  );

  const propertySummaries = React.useMemo(() => {
    if (reviews) {
      return getPropertySummaries(reviews);
    }
    return [];
  }, [reviews]);

  // Handle clearing filter if property is no longer in summaries
  React.useEffect(() => {
    if (
      selectedProperty &&
      !propertySummaries.some((p) => p.name === selectedProperty)
    ) {
      setSelectedProperty(null);
    }
  }, [selectedProperty, propertySummaries]);

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (isError) {
    return <div>Error fetching reviews: {error.message}</div>;
  }

  return (
    <div className="flex">
      {/* Property Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Properties</h2>
        <ul className="text-sm">
          <li
            className={`cursor-pointer p-2 rounded mb-2 ${
              selectedProperty === null ? 'bg-blue-100 dark:bg-blue-700' : ''
            }`}
            onClick={() => setSelectedProperty(null)}
          >
            All Properties ({reviews?.length || 0} reviews)
          </li>
          {propertySummaries.map((property) => (
            <li
              key={property.name}
              className={`cursor-pointer p-2 rounded mb-2 ${
                selectedProperty === property.name
                  ? 'bg-blue-100 dark:bg-blue-700'
                  : ''
              }`}
              onClick={() => setSelectedProperty(property.name)}
            >
              <h3 className="font-semibold">{property.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Reviews: {property.reviewCount}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Overall Avg: {property.averageOverallRating ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Cleanliness Avg: {property.averageCleanlinessRating ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Communication Avg:{' '}
                {property.averageCommunicationRating ?? 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Reviews Dashboard ({reviews?.length || 0} reviews)
        </h1>
        {/* If there are reviews, render the DataTable. Otherwise show a message. */}
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
  );
}

export default DashboardPage;
