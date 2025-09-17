import React from 'react';
import { CircleArrowUp, CircleArrowDown } from 'lucide-react'; // Need these icons

// Define a type for our property summary data (should match the one in DashboardPage.tsx)
interface PropertySummary {
  name: string;
  averageOverallRating: number | null;
  averageCleanlinessRating: number | null;
  averageCommunicationRating: number | null;
  reviewCount: number;
  overallPerformance: 'good' | 'average' | 'bad';
  trend: 'up' | 'down' | 'stable';
}

interface PropertySidebarProps {
  summaries: PropertySummary[];
  selectedProperty: string | null;
  onSelectProperty: (propertyName: string | null) => void;
  totalReviews: number;
}

export function PropertySidebar({
  summaries,
  selectedProperty,
  onSelectProperty,
  totalReviews,
}: PropertySidebarProps) {
  // Determine text color based on overall performance
  const getPerformanceTextColor = (performance: 'good' | 'average' | 'bad') => {
    switch (performance) {
      case 'good':
        return 'text-green-500 dark:text-green-400';
      case 'bad':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-yellow-500 dark:text-yellow-400';
    }
  };

  // Determine trend icon and color
  const getTrendIndicator = (
    trend: 'up' | 'down' | 'stable',
  ): { icon: React.ReactNode; color: string; text: string } => {
    switch (trend) {
      case 'up':
        return {
          icon: <CircleArrowUp className="h-4 w-4" />,
          color: 'text-green-500',
          text: 'Trending Up',
        };
      case 'down':
        return {
          icon: <CircleArrowDown className="h-4 w-4" />,
          color: 'text-red-500',
          text: 'Trending Down',
        };
      default:
        return { icon: null, color: '', text: '' }; // No indicator for stable
    }
  };

  return (
    <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Properties Overview</h2>
        <ul className="text-sm">
          {/* "All Properties" option */}
          <li
            className={`cursor-pointer p-2 rounded mb-2 flex items-center justify-between ${
              selectedProperty === null ? 'bg-blue-100 dark:bg-blue-700' : ''
            }`}
            onClick={() => onSelectProperty(null)}
          >
            <span>All Properties ({totalReviews} reviews)</span>
          </li>

          {/* Individual Property Summaries */}
          {summaries.map((property) => {
            const {
              icon: TrendIcon,
              color: trendColor,
              text: trendText,
            } = getTrendIndicator(property.trend);
            return (
              <li
                key={property.name}
                className={`cursor-pointer p-2 rounded mb-2 ${
                  selectedProperty === property.name
                    ? 'bg-blue-100 dark:bg-blue-700'
                    : ''
                }`}
                onClick={() => onSelectProperty(property.name)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">{property.name}</h3>
                  {/* Render the trend indicator if it exists */}
                  {TrendIcon && (
                    <span
                      className={`flex items-center text-xs font-semibold ${trendColor}`}
                    >
                      {TrendIcon}
                      <span className="ml-1">{trendText}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Reviews: {property.reviewCount}
                </p>
                {/* ... (rest of the summary details remain the same) ... */}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
