'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type Review } from '@/schemas';
import React from 'react';

// This is the core of the table definition. `ColumnDef` is a generic type,
// and we pass our `Review` type to it for full type safety.
export const columns: ColumnDef<Review>[] = [
  {
    id: 'select', // Unique ID for this column
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false, // Selection column shouldn't be sortable
    enableHiding: false, // Selection column shouldn't be hideable
  },
  {
    accessorKey: 'guestName',
    header: 'Guest',
  },
  {
    accessorKey: 'listingName',
    header: 'Property',
    cell: ({ row }) => (
      <Link
        to="/properties/$propertyName"
        params={{
          propertyName: encodeURIComponent(row.getValue('listingName')),
        }}
        className="font-semibold hover:underline"
      >
        {row.getValue('listingName')}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      const variant: 'default' | 'destructive' | 'secondary' =
        status === 'published'
          ? 'default'
          : status === 'rejected'
            ? 'destructive'
            : 'secondary';

      const statusText = status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <Badge
          variant={variant}
          className={`w-[100px] flex justify-center ${
            status === 'success'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : ''
          }`}
        >
          {statusText}
        </Badge>
      );
    },
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

      const badgeWidthClass = 'w-[140px]'; // Adjusted for slightly more room if needed

      return (
        <div className="flex flex-wrap gap-1">
          {categories.map(({ category, rating }) => (
            <Badge
              key={category}
              variant={getBadgeVariant(rating)}
              className={`${getBadgeVariant(rating)} ${badgeWidthClass} flex justify-between`}
            >
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
    cell: ({ row }) => (
      <div className="font-semibold text-md text-center">
        {row.getValue('rating') ?? 'N/A'}
      </div>
    ),
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
