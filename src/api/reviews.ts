import { useQuery } from '@tanstack/react-query';
import { reviewsSchema, type Review } from '../schemas';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCOUNT_ID = import.meta.env.VITE_HOSTAWAY_ACCOUNT_ID;
const API_KEY = import.meta.env.VITE_HOSTAWAY_API_KEY;

if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not defined. Please check your .env file.');
}

/**
 * Fetches the reviews from our mock API, then parses the response
 * against our Zod schema to ensure it's type-safe.
 */
const getReviews = async (): Promise<Review[]> => {
    // TODO: Important: You must implement the API route that fetches and normalizes
    //  reviews (e.g. GET /api/reviews/hostaway). This route will be tested and
    //  should return structured, usable data for the frontend.
    // Although our mock API doesn't need these, this is how you would
    // structure the call for a real-world, authenticated API.
    const requestHeaders = new Headers();
    if (ACCOUNT_ID && API_KEY) {
        requestHeaders.set('X-Account-ID', ACCOUNT_ID);
        requestHeaders.set('Authorization', `Bearer ${API_KEY}`);
    }

    const response = await fetch(`${API_BASE_URL}/api/reviews/hostaway`, {
        headers: requestHeaders,
    });
    if (!response.ok) {
        throw new Error('Failed to fetch reviews.');
    }
    const data = await response.json();

    // Use the Zod schema to parse and validate the data.
    // This will throw an error if the API response doesn't match the schema.
    // TODO: TASK 2: Parse and normalize reviews by listing, review type, channel, and date. (DONE)
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