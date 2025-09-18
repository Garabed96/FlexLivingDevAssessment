import React from 'react';
import { useGetReviews } from '@/api/reviews';
import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

// Main component to display a list of all properties with published reviews
export function PropertysPage() {
  const { data: reviews, isLoading } = useGetReviews();

  const properties = React.useMemo(() => {
    if (!reviews) return [];
    // First, get all reviews that are successfully published
    const published = reviews.filter((r) => r.status === 'success');
    // Then, get the unique names of the properties from that list
    const propertyNames = [...new Set(published.map((r) => r.listingName))];
    return propertyNames.sort();
  }, [reviews]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((name) => (
          <Link
            key={name}
            to="/properties/$propertyName"
            params={{ propertyName: encodeURIComponent(name) }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
