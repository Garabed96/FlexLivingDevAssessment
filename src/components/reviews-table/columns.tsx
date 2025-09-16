'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type Review } from '@/schemas'; // Using the '@' alias we set up
import React from "react";

// This is the core of the table definition. `ColumnDef` is a generic type,
// and we pass our `Review` type to it for full type safety.
export const columns: ColumnDef<Review>[] = [
    {
        accessorKey: 'guestName',
        header: 'Guest',
    },
    {
        accessorKey: 'listingName',
        header: 'Property',
    },
    {
        accessorKey: 'publicReview',
        header: 'Review',
        // We can customize the cell rendering. Here, we truncate long reviews.
        cell: ({ row }) => {
            const reviewText: string = row.getValue('publicReview');
            const maxLength = 100;
            if (reviewText.length <= maxLength) {
                return <div>{reviewText}</div>;
            }
            return <div>{`${reviewText.substring(0, maxLength)}...`}</div>;
        },
    },
    {
        accessorKey: 'rating',
        header: 'Overall Rating',
    },
    {
        accessorKey: 'submittedAt',
        header: 'Date',
        // Format the date for better readability
        cell: ({ row }) => {
            const date: Date = row.getValue('submittedAt');
            const formatted = date.toLocaleDateString();
            return <div>{formatted}</div>;
        },
    },
];