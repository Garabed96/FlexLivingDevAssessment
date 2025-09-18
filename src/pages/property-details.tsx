import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Star } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Faqs } from '@/faqs.ts';
import { useParams } from '@tanstack/react-router';
import { useGetReviews } from '@/api/reviews';
import { Link } from '@tanstack/react-router';
import { type Review } from '@/schemas';

// Utility functions for reviews
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2419200)
    return `${Math.floor(diffInSeconds / 2419200)} months ago`;
  if (diffInSeconds < 29030400)
    return `${Math.floor(diffInSeconds / 29030400)} years ago`;
  return `${Math.floor(diffInSeconds / 29030400)} years ago`; // Fallback for very old
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-green-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-pink-600',
    'from-cyan-500 to-blue-600',
  ];

  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Individual Review Component
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.publicReview.length > 200;
  const displayText = isExpanded
    ? review.publicReview
    : shouldTruncate
      ? `${review.publicReview.slice(0, 200)}...`
      : review.publicReview;

  return (
    <div className="space-y-3 pb-4 border-b border-neutral-200 last:border-b-0">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(review.guestName)} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}
        >
          <span className="text-white text-sm font-semibold">
            {getInitials(review.guestName)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-neutral-900 text-sm">
              {review.guestName}
            </span>
            <span className="text-neutral-500 text-xs">•</span>
            <span className="text-neutral-600 text-xs">
              {formatRelativeTime(new Date(review.submittedAt))}
            </span>
          </div>

          {review.rating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(review.rating! / 2)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-neutral-400'
                  }`}
                />
              ))}
              <span className="text-neutral-600 text-xs ml-1">
                {review.rating}/10
              </span>
            </div>
          )}

          <p className="text-sm text-neutral-700 leading-relaxed mb-2">
            {displayText}
          </p>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Reviews Summary Component
interface ReviewsSummaryProps {
  reviews: Review[];
}

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({ reviews }) => {
  const reviewsWithRating = reviews.filter((r) => r.rating !== null);

  const averageRating =
    reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, r) => sum + r.rating!, 0) /
        reviewsWithRating.length
      : 0;

  // Convert 10-point scale to 5-point scale for display
  const displayRating = averageRating / 2;

  // Rating distribution (convert to 5-star scale)
  const ratingCounts = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]

  reviewsWithRating.forEach((review) => {
    const starRating = Math.ceil(review.rating! / 2) - 1; // Convert 10-point to 5-point, then to 0-based index
    if (starRating >= 0 && starRating < 5) {
      ratingCounts[starRating]++;
    }
  });

  const totalWithRatings = reviewsWithRating.length;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-neutral-600 text-sm">
          No published reviews yet for this property.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
          <span className="text-2xl font-bold text-neutral-900">
            {displayRating.toFixed(1)}
          </span>
        </div>
        <div className="text-sm text-neutral-600">
          Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          {totalWithRatings !== reviews.length && (
            <span className="block text-xs">
              ({totalWithRatings} with ratings)
            </span>
          )}
        </div>
      </div>

      {/* Rating Breakdown */}
      {totalWithRatings > 0 && (
        <div className="space-y-2 mb-6">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars - 1];
            const percentage =
              totalWithRatings > 0 ? (count / totalWithRatings) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-neutral-700 w-2 text-right">
                    {stars}
                  </span>
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 rounded-full h-2 transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-neutral-600 w-8 text-right text-xs">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export function ReviewsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const { propertyName } = useParams({ from: '/properties/$propertyName' });
  const { data: allReviews, isLoading } = useGetReviews();

  const decodedPropertyName = decodeURIComponent(propertyName);

  // Get property data and reviews
  const { propertyData, propertyReviews } = React.useMemo(() => {
    if (!allReviews || !propertyName) {
      return { propertyData: null, propertyReviews: [] };
    }

    const property = allReviews.find(
      (review) => review.listingName === decodedPropertyName,
    );

    const reviews = allReviews
      .filter(
        (review) =>
          review.listingName === decodedPropertyName &&
          review.status === 'success',
      )
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );

    return { propertyData: property, propertyReviews: reviews };
  }, [allReviews, decodedPropertyName, propertyName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
        <div className="animate-pulse text-lg text-neutral-600">
          Loading property details...
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            Property Not Found
          </h1>
          <p className="text-neutral-600">
            Could not find property: {decodedPropertyName}
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = [1, 2, 3, 4, 5].map(
    (i) => `https://picsum.photos/1200/80${i}`,
  );

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#FBFAF9] text-neutral-900">
      <main className="max-w-7xl mx-auto p-6">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Properties</span>
        </Link>

        {/* Title + Type */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{propertyData.listingName}</h2>
          <p className="text-neutral-600 text-lg capitalize">
            {propertyData.type}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-96 mb-8">
          <img
            src={images[0]}
            alt="Property 1"
            className="rounded-lg object-cover w-full h-full col-span-1 row-span-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              setCurrentIndex(0);
              setOpen(true);
            }}
          />

          {images.slice(1).map((src, i) => (
            <img
              key={i + 1}
              src={src}
              alt={`Property ${i + 2}`}
              className="rounded-lg object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                setCurrentIndex(i + 1);
                setOpen(true);
              }}
            />
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-5xl p-0 bg-black">
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <img
                src={images[currentIndex]}
                alt="Property Large"
                className="max-h-[80vh] w-auto object-contain"
              />

              <button
                onClick={prevImage}
                className="absolute left-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="flex justify-center gap-2 py-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-white' : 'bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          {/* Left Content Column - Static content preserved */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <p>
                Flexliving offers you a charming studio located on the 2nd floor
                of a beautiful Parisian building in the 14th arrondissement of
                Paris. It is composed of a double bed, an equipped kitchen and a
                bathroom with WC.
              </p>
              <ul className="list-disc list-inside text-neutral-900">
                <li>Close to Pernéty metro station (line 13)</li>
                <li>Wifi available</li>
                <li>Sheets included</li>
                <li>Towel not provided</li>
                <li>Turnkey accommodation, lease from 1 to 10 months</li>
              </ul>
            </div>

            {/* Continue with other static sections... */}
            <section>
              <h3 className="text-xl font-semibold mb-2">Rooms available</h3>
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <img
                    src="https://picsum.photos/200/150"
                    alt="Room"
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Studio</p>
                    <p className="text-neutral-600">2200€ / month</p>
                  </div>
                  <Button variant="secondary">Remove this room</Button>
                </CardContent>
              </Card>
            </section>

            {/* Housing Benefits */}
            <section>
              <h3 className="text-xl font-semibold mb-2 mt-8">
                Housing benefits
              </h3>
              <div className="text-md text-neutral-600 mb-2">Services</div>
              <ul className="grid grid-cols-2 gap-2 text-neutral-700">
                <li>🚫 Pets not allowed</li>
                <li>🚭 Non-smoker</li>
                <li>🔥 Heating</li>
                <li>🧊 Refrigerator</li>
                <li>☕ Coffee machine</li>
                <li>🧺 Washing machine</li>
              </ul>
            </section>

            {/* Neighborhood */}
            <section>
              <h3 className="text-xl font-semibold mb-2">The neighborhood</h3>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="https://picsum.photos/800/300"
                  alt="Map"
                  className="w-full object-cover"
                />
              </div>
              <p className="text-neutral-700 mt-2 mb-8">
                The Plaisance district in Paris, located in the 14th
                arrondissement, offers an urban experience balanced between work
                and relaxation. Surrounded by quaint cafes, authentic bakeries
                and bustling markets, it seduces with its friendly atmosphere.
                The tree-lined streets invite you to stroll, while the proximity
                of Montparnasse train station makes business travel easier. For
                a cultural break, Montsouris Park offers a haven of peace, and
                the famous Montparnasse cemetery reveals the literary and
                artistic history of the district. Plaisance thus embodies the
                harmonious marriage between urban dynamism and Parisian charm.
              </p>
            </section>

            {/* Reservation Policy */}
            <section>
              <h3 className="text-xl font-semibold mb-2">Reservation policy</h3>
              <p className="text-neutral-700 mb-2">
                This accommodation is rented monthly for a minimum period of 30
                days. If you rent a private room in a shared apartment, only one
                person is allowed per room, additional companions are not
                allowed. If you rent a studio or a T2, then you have private
                accommodation that can accommodate up to two people.
              </p>
              <div className="grid grid-cols-2 gap-4 text-neutral-700">
                <div>
                  <p className="font-semibold">Arrival</p>
                  <p>Arrival time</p>
                  <p className="text-neutral-700">from 5:00pm</p>
                </div>
                <div>
                  <p className="font-semibold">Departure</p>
                  <p>Departure time</p>
                  <p className="text-neutral-700">before 10:00am</p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Modification of reservation policy
              </h2>
              <p className="text-neutral-700 mb-2 text-sm">
                Reservations can be canceled free of charge 30 days before the
                start date of the stay. If the stay is in progress, cancellation
                is possible with 30 days' notice. Extensions of stays are done
                online, our teams are at your disposal for any additional
                questions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900">
                The most frequently asked questions
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {Faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-[14px] leading-[150%]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[14px] leading-[150%]">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Right Column - Booking Summary & REVIEWS */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Summary Card */}
              <Card className="bg-white border-neutral-200 text-neutral-900">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold">Summary</h3>
                  <div className="space-y-2">
                    <p>
                      Arrival: <span className="font-medium">September 17</span>
                    </p>
                    <p>
                      Departure: <span className="font-medium">October 17</span>
                    </p>
                  </div>
                  <div className="border-t border-neutral-200"></div>
                  <div className="space-y-2">
                    <p className="text-lg">Studio</p>
                    <p className="text-neutral-600">2200€ / month</p>
                    <p className="text-neutral-700 font-semibold">
                      2290€ total (incl. fees)
                    </p>
                  </div>
                  <Button className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold">
                    Reserve
                  </Button>
                  <p className="text-xs text-neutral-500 text-center">
                    No amount will be charged at this time.
                  </p>
                </CardContent>
              </Card>

              {/* REVIEWS SECTION */}
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-6">
                  <ReviewsSummary reviews={propertyReviews} />

                  {propertyReviews.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-neutral-900 text-sm">
                        Recent Reviews
                      </h4>

                      <div className="max-h-96 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-transparent pr-2">
                        {propertyReviews.slice(0, 10).map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>

                      {propertyReviews.length > 10 && (
                        <div className="text-center pt-2">
                          <p className="text-xs text-neutral-600">
                            Showing 10 of {propertyReviews.length} reviews
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
