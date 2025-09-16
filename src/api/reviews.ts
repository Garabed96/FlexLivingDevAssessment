import { useQuery } from '@tanstack/react-query';
import { reviewsSchema, type Review } from '../schemas';

/**
 * Fetches the reviews from our mock API, then parses the response
 * against our Zod schema to ensure it's type-safe.
 */
const getReviews = async (): Promise<Review[]> => {
    const response = await fetch('http://localhost:3001/reviews');
    if (!response.ok) {
        throw new Error('Failed to fetch reviews.');
    }
    const data = await response.json();

    // Use the Zod schema to parse and validate the data.
    // This will throw an error if the API response doesn't match the schema.
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