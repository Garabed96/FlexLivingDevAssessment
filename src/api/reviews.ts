import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { reviewsSchema, type Review } from '../schemas';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const isProduction = import.meta.env.PROD;

/**
 * Fetches the reviews from our mock API, then parses the response
 * against our Zod schema to ensure it's type-safe.
 */
const getReviews = async (): Promise<Review[]> => {
  // Determine the correct API endpoint based on the environment
  const endpoint = isProduction ? `/api/reviews` : `${API_BASE_URL}/reviews`;

  const requestHeaders = new Headers();
  if (isProduction) {
    // These headers are only needed for the Vercel function
    const ACCOUNT_ID = import.meta.env.VITE_HOSTAWAY_ACCOUNT_ID;
    const API_KEY = import.meta.env.VITE_HOSTAWAY_API_KEY;
    if (ACCOUNT_ID && API_KEY) {
      requestHeaders.set('X-Account-ID', ACCOUNT_ID);
      requestHeaders.set('Authorization', `Bearer ${API_KEY}`);
    }
  }

  const response = await fetch(endpoint, {
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reviews.');
  }
  const data = await response.json();

  return reviewsSchema.parse(data);
};

/**
 * A custom TanStack Query hook for fetching review data.
 * It handles caching, loading states, and error states for us.
 */
export const useGetReviews = () => {
  return useQuery({
    // queryKey is used by TanStack Query to cache this data.
    queryKey: ['reviews'],
    // queryFn is the function that will be called to fetch the data.
    queryFn: getReviews,
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updatedData
    }: Partial<Review> & { id: number }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/hostaway/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update review.');
      }
      return response.json();
    },
    // After the mutation is successful, invalidate the 'reviews' query
    // to trigger a refetch and ensure the UI has the latest data.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    // Optimistic Update: Update the cache before the mutation is sent
    onMutate: async (updatedReview: Partial<Review> & { id: number }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['reviews'] });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueryData<Review[]>(['reviews']);

      // Optimistically update the cache for the specific review
      queryClient.setQueryData<Review[]>(['reviews'], (old) =>
        old
          ? old.map((review) =>
              review.id === updatedReview.id
                ? { ...review, ...updatedReview }
                : review,
            )
          : [],
      );

      // Return a context object with the snapshotted value
      return { previousReviews };
    },
    // If the mutation fails, use the context we returned from onMutate to roll back
    onError: (err, updatedReview, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['reviews'], context.previousReviews);
      }
      console.log(
        `Update failed: ${err.message} \n review.id: ${updatedReview.id}`,
      );
      // You might want to show a toast/notification here
      console.error('Failed to update review:', err);
    },
    // Always refetch after error or success:
    // Ensure the todo list is synced with the backend regardless of whether the mutation succeeded or failed.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
