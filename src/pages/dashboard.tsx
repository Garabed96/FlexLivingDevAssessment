import React from "react";
import { useGetReviews } from '../api/reviews';

function DashboardPage() {
    const { data: reviews, isLoading, isError, error } = useGetReviews();

    if (isLoading) {
        return <div>Loading reviews...</div>;
    }

    if (isError) {
        return <div>Error fetching reviews: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reviews Dashboard</h1>
            <p>
                Successfully fetched {reviews?.length || 0} reviews. We can now build
                the data table here.
            </p>
            {/* We can temporarily display the raw data to confirm it works */}
            <pre className="mt-4 bg-gray-100 p-2 rounded">
        {JSON.stringify(reviews, null, 2)}
      </pre>
        </div>
    );
}

export default DashboardPage;