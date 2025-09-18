import db from './db.json' with { type: 'json' };

export default function handler(req, res) {
  const { id } = req.query;
  let reviews = db.reviews; // Use 'let' if you want to modify it in-memory for the demo

  // Handle GET requests (already working)
  if (req.method === 'GET') {
    if (id) {
      const review = reviews.find((r) => r.id === Number(id));
      if (review) {
        return res.status(200).json(review);
      } else {
        return res.status(404).json({ message: 'Review not found' });
      }
    }
    return res.status(200).json(reviews);
  }

  // Handle PATCH requests
  if (req.method === 'PATCH') {
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Review ID is required for PATCH.' });
    }

    const reviewId = Number(id);
    const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // In a real backend, you'd apply the patch to the database here.
    // For Vercel serverless functions with db.json, we simulate success.
    const updatedFields = req.body; // Assuming req.body contains the fields to update

    // Create a new review object with updated fields
    const updatedReview = {
      ...reviews[reviewIndex],
      ...updatedFields,
      id: reviewId,
    };

    // Optionally, you can update the in-memory array for this specific request context
    // This won't persist, but ensures if another GET request happens in the *same* invocation,
    // it would see the "updated" state. For this demo, it's mostly to return the correct data.
    reviews[reviewIndex] = updatedReview;

    return res.status(200).json(updatedReview);
  }

  // Handle other methods (optional)
  res.status(405).json({ message: 'Method Not Allowed' });
}
