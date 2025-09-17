import React from 'react';
import { CircleArrowUp, CircleArrowDown, MinusCircle } from 'lucide-react'; // Need these icons
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  totalProperties: number;
  performanceFilter: string;
  setPerformanceFilter: (value: string) => void;
  trendFilter: string;
  setTrendFilter: (value: string) => void;
}

export function PropertySidebar({
  summaries,
  selectedProperty,
  onSelectProperty,
  totalReviews,
  totalProperties,
  performanceFilter,
  setPerformanceFilter,
  trendFilter,
  setTrendFilter,
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

  // Determine trend icon, text, and color
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
      case 'stable': // Add this new case
        return {
          icon: <MinusCircle className="h-4 w-4" />,
          color: 'text-gray-500',
          text: 'Stable',
        };
      default:
        return { icon: null, color: '', text: '' }; // Keep as a fallback
    }
  };

  return (
    <div className="w-1/4 p-4 border-r border-gray-200 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Properties Overview</h2>
      <ul className="text-sm">
        {/* "All Properties" option */}
        <li
          className={`cursor-pointer p-2 rounded-md flex items-center justify-between text-sm font-semibold ${
            selectedProperty === null
              ? 'bg-muted text-primary'
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onSelectProperty(null)}
        >
          <span>All Properties: {totalProperties}</span>
          <span className="text-muted-foreground">
            Review Count: {totalReviews}
          </span>
        </li>

        {/*Performance Filters and Trend Filters*/}
        <div className="space-y-2 px-2 mb-4">
          <div>
            <label className="text-sm font-medium">Filter by Performance</label>
            <Select
              value={performanceFilter}
              onValueChange={setPerformanceFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="good">Good (8.5+)</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="bad">Bad (&lt;=6.5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Filter by Trend</label>
            <Select value={trendFilter} onValueChange={setTrendFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="up">Trending Up</SelectItem>
                <SelectItem value="down">Trending Down</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
              className={`cursor-pointer p-2 rounded-md space-y-1 ${
                selectedProperty === property.name
                  ? 'bg-primary text-primary-foreground' // Use primary colors when selected
                  : 'hover:bg-muted/50'
              }`}
              onClick={
                () =>
                  selectedProperty === property.name
                    ? onSelectProperty(null) // If already selected, deselect
                    : onSelectProperty(property.name) // Otherwise, select this property
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">{property.name}</h3>
                {TrendIcon && (
                  <span
                    className={`flex items-center text-xs font-semibold ${trendColor}`}
                  >
                    {TrendIcon}
                    <span className="ml-1">{trendText}</span>
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p
                  className={`font-bold ${getPerformanceTextColor(
                    property.overallPerformance,
                  )}`}
                >
                  Avg Rating: {property.averageOverallRating ?? 'N/A'}
                </p>

                <p className="font-semibold">
                  Cleanliness: {property.averageCleanlinessRating ?? 'N/A'}
                </p>
                <p className="font-semibold">
                  Communication: {property.averageCommunicationRating ?? 'N/A'}
                </p>

                <p>Reviews: {property.reviewCount}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
