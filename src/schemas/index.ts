import { z } from 'zod';

/**
 * Defines the schema for a sub-category within a review, like cleanliness or communication.
 */
const reviewCategorySchema = z.object({
    category: z.string(),
    rating: z.number(),
});

/**
 * Defines the main schema for a single review object.
 * This will be used to parse and validate data fetched from the API.
 */
export const reviewSchema = z.object({
    id: z.coerce.number(),
    type: z.string(),
    status: z.string(),
    publicReview: z.string(),
    submittedAt: z.string().pipe(z.coerce.date()), // Coerces the date string into a JS Date object
    guestName: z.string(),
    listingName: z.string(),

    // The overall rating can be a number or null, so we mark it as nullable.
    rating: z.number().nullable(),

    // A review contains an array of category-specific ratings.
    reviewCategory: z.array(reviewCategorySchema),

    // This is our custom field, not from the API, for tracking manager approval.
    // We make it optional so existing data without this field still validates.
    isApproved: z.boolean().optional(),
});

/**
 * Defines a schema for an array of reviews, which is what our API will return.
 */
export const reviewsSchema = z.array(reviewSchema);

// We infer the TypeScript `Review` type directly from the Zod schema.
// This ensures our types and validation rules always stay in sync.
export type Review = z.infer<typeof reviewSchema>;