import React from "react";
import { useGetReviews } from '../api/reviews';
import { columns } from '@/components/reviews-table/columns'; // Import the columns
import { DataTable } from '@/components/reviews-table/data-table.tsx'; // Import the DataTable

function DashboardPage() {
    const { data: reviews, isLoading, isError, error } = useGetReviews();

    if (isLoading) {
        return <div>Loading reviews...</div>;
    }

    if (isError) {
        return <div>Error fetching reviews: {error.message}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Reviews Dashboard</h1>
            {/* If there are reviews, render the DataTable. Otherwise show a message. */}
            {reviews ? (
                <DataTable columns={columns} data={reviews} />
            ) : (
                <p>No reviews found.</p>
            )}
        </div>
    );
}

export default DashboardPage;
