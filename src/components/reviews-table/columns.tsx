'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react'; // New icon import
import { Button } from '@/components/ui/button'; // New button import
import { Badge } from '@/components/ui/badge'; // Import the Badge component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type Review } from '@/schemas'; // Using the '@' alias we set up
import React from 'react';

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
    cell: ({ row }) => {
      const reviewText: string = row.getValue('publicReview');
      const guestName: string = row.getValue('guestName');
      const maxLength = 100;

      const truncatedText =
        reviewText.length > maxLength
          ? `${reviewText.substring(0, maxLength)}...`
          : reviewText;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer hover:underline">
              {truncatedText}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Review from {guestName}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm">{reviewText}</div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: 'reviewCategory',
    header: 'Category Ratings',
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) {
        return true;
      }

      const reviewCategories = row.getValue(id) as {
        category: string;
        rating: number;
      }[];

      // This logic now checks if the row's data satisfies EVERY selected filter.
      // e.g., if user selects "High Cleanliness" AND "Low Communication"
      return value.every((filterValue) => {
        // Parse the filter value, e.g., "cleanliness:high"
        const [category, threshold] = filterValue.split(':');

        // Find the matching category in the review's data
        const reviewCategory = reviewCategories.find(
          (rc) => rc.category === category,
        );

        // If the review doesn't even have this category, it's not a match.
        if (!reviewCategory) {
          return false;
        }

        // Apply the threshold logic
        if (threshold === 'high') {
          return reviewCategory.rating >= 8;
        }
        if (threshold === 'low') {
          return reviewCategory.rating <= 5;
        }

        return false;
      });
    },
    // We create a custom cell renderer to display the badges
    cell: ({ row }) => {
      const categories: { category: string; rating: number }[] =
        row.getValue('reviewCategory');

      // Helper to determine badge color based on rating
      const getBadgeVariant = (
        rating: number,
      ): 'destructive' | 'secondary' | 'default' => {
        if (rating <= 5) return 'destructive';
        if (rating <= 8) return 'secondary';
        return 'default'; // 'default' will use your primary theme color
      };

      return (
        <div className="flex flex-wrap gap-1">
          {categories.map(({ category, rating }) => (
            <Badge key={category} variant={getBadgeVariant(rating)}>
              {/* Capitalize category name and show rating */}
              {`${
                category.charAt(0).toUpperCase() +
                category.slice(1).replace(/_/g, ' ')
              }: ${rating}`}
            </Badge>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: 'rating',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Overall Rating
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // Format the date for better readability
    cell: ({ row }) => {
      const date: Date = row.getValue('submittedAt');
      const formatted = date.toLocaleDateString();
      return <div>{formatted}</div>;
    },
  },
];
