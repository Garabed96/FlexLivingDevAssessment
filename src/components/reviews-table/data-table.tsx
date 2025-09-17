'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState, // New import for managing filter state
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel, // New import for filtering logic
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input'; // Import the Input component
import { DataTableFacetedFilter } from '@/components/reviews-table/faceted-filter.tsx';

// Define the options for the category filter
const categoryFilterOptions = [
  { label: 'High Cleanliness (8+)', value: 'cleanliness:high' },
  { label: 'High Communication (8+)', value: 'communication:high' },
  { label: 'Low Cleanliness (<=5)', value: 'cleanliness:low' },
  { label: 'Low Communication (<=5)', value: 'communication:low' },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // New state to manage the column filters
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // Add the sort-related properties to the table instance
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {/* This is our new filter input */}
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filter by property..."
          value={
            (table.getColumn('listingName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('listingName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {table.getColumn('reviewCategory') && (
          <DataTableFacetedFilter
            column={table.getColumn('reviewCategory')}
            title="Category"
            options={categoryFilterOptions}
          />
        )}
      </div>
      {/* The rest of the table remains the same */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
