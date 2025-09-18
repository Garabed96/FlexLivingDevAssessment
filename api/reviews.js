import db from 'db.json';

export default function handler(req, res) {
  const { id } = req.query;
  const reviews = db.reviews;

  if (id) {
    const review = reviews.find((r) => r.id === Number(id));
    if (review) {
      return res.status(200).json(review);
    } else {
      return res.status(404).json({ message: 'Review not found' });
    }
  }

  res.status(200).json(reviews);
}
