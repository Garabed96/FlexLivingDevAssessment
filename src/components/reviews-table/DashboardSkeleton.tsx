import React from 'react';

const SkeletonCard = () => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen p-4 space-x-4">
      {/* Sidebar Skeleton */}
      <div className="w-1/4 max-w-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 space-y-4">
        {/* Header and filters */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Table Skeleton */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex space-x-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
