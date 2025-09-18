import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Star } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Faqs } from '@/faqs.ts'; // Mock FAQ data
import { useParams } from '@tanstack/react-router';
import { useGetReviews } from '@/api/reviews';
import { Link } from '@tanstack/react-router';

export function ReviewsPage() {
  // Store current index for carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const { propertyName } = useParams({ from: '/properties/$propertyName' });
  const { data: reviews, isLoading } = useGetReviews();

  // Find the first review that matches this property to get its data
  const propertyData = React.useMemo(() => {
    if (!reviews || !propertyName) return null;
    return reviews.find(
      (review) => review.listingName === decodeURIComponent(propertyName),
    );
  }, [reviews, propertyName]);

  const decodedPropertyName = decodeURIComponent(propertyName);

  if (isLoading) {
    return <div>Loading property details...</div>;
  }

  if (!propertyData) {
    return <div>Could not find property: {decodedPropertyName}</div>;
  }

  const images = [1, 2, 3, 4, 5].map(
    (i) => `https://picsum.photos/1200/80${i}`,
  );

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#FBFAF9] text-neutral-900">
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto p-6">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-neutral-900 hover:text-neutral-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6">
            Back to Properties
          </span>
        </Link>
        {/* Title + Address - Full Width */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{propertyData.listingName}</h2>
          <p className="text-neutral-900 text-lg">{propertyData.type}</p>
        </div>

        {/* Image Grid - Full Width */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-96 mb-8">
          {/* Large left image */}
          <img
            src={images[0]}
            alt="Property 1"
            className="rounded-lg object-cover w-full h-full col-span-1 row-span-2 cursor-pointer"
            onClick={() => {
              setCurrentIndex(0);
              setOpen(true);
            }}
          />

          {/* Right 2x2 images */}
          {images.slice(1).map((src, i) => (
            <img
              key={i + 1}
              src={src}
              alt={`Property ${i + 2}`}
              className="rounded-lg object-cover w-full h-full cursor-pointer"
              onClick={() => {
                setCurrentIndex(i + 1);
                setOpen(true);
              }}
            />
          ))}
        </div>

        {/* Lightbox / Carousel */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-5xl p-0 bg-black">
            <div className="relative flex items-center justify-center">
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image */}
              <img
                src={images[currentIndex]}
                alt="Property Large"
                className="max-h-[80vh] w-auto object-contain"
              />

              {/* Left arrow */}
              <button
                onClick={prevImage}
                className="absolute left-4 bg-black/50 p-2 rounded-full text-white hover:bg-black"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Right arrow */}
              <button
                onClick={nextImage}
                className="absolute right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 py-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    i === currentIndex ? 'bg-white' : 'bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          {/* Left Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
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

            {/* Available Rooms */}
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

          {/* Right Column - Sticky Booking Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <Card className="bg-neutral-800 border-neutral-700 text-neutral-200">
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
                  <div className="border-t border-neutral-700"></div>
                  <div className="space-y-2">
                    <p className="text-lg">Studio</p>
                    <p className="text-neutral-400">2200€ per month</p>
                    <p className="text-neutral-400 font-semibold">
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
            </div>
            {/* Reviews Section */}
            {/* Reviews Section */}
            <Card className="bg-neutral-800 border-neutral-700 mt-6">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-white">4.8</span>
                  </div>
                  <div className="text-sm text-neutral-400">
                    Based on 28 reviews
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3 mb-6">
                  {[
                    { stars: 5, percentage: 75, count: 21 },
                    { stars: 4, percentage: 18, count: 5 },
                    { stars: 3, percentage: 7, count: 2 },
                    { stars: 2, percentage: 0, count: 0 },
                    { stars: 1, percentage: 0, count: 0 },
                  ].map((rating) => (
                    <div
                      key={rating.stars}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-neutral-300">{rating.stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 rounded-full h-2 transition-all duration-300"
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-neutral-400 w-8 text-right">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recent Reviews - Scrollable */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white text-sm">Reviews</h4>

                  {/* Scrollable Reviews Container */}
                  <div className="max-h-80 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent pr-2">
                    {/* Review 1 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            M
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              Marie
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Perfect location and beautifully furnished. The
                            host was incredibly responsive and helpful. Would
                            definitely stay again!"
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            2 weeks ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 2 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            J
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              James
                            </span>
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                              <Star className="h-3 w-3 text-neutral-600" />
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Clean, comfortable space with excellent amenities.
                            Great value for money in this area of Paris."
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            1 month ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 3 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            S
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              Sarah
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Amazing studio! Everything was exactly as
                            described. The neighborhood is fantastic with great
                            restaurants nearby."
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            2 months ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 4 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            A
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              Alex
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Excellent communication from the host. The
                            apartment was spotless and had everything we needed
                            for our stay."
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            2 months ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 5 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            L
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              Lisa
                            </span>
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                              <Star className="h-3 w-3 text-neutral-600" />
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Good location and nice amenities. Only minor issue
                            was the WiFi being a bit slow, but overall a great
                            stay."
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            3 months ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 6 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            D
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              David
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Fantastic stay! The studio is modern, clean, and
                            perfectly located. Host provided excellent local
                            recommendations."
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            3 months ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 7 */}
                    <div className="space-y-3 pb-4 border-b border-neutral-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            E
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              Emma
                            </span>
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                              <Star className="h-3 w-3 text-neutral-600" />
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Lovely place with all the essentials. Great
                            neighborhood for exploring Paris. Would recommend to
                            friends!"
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            4 months ago
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review 8 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            T
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              Thomas
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300">
                            "Outstanding experience from start to finish. The
                            space exceeded our expectations and the host was
                            incredibly welcoming."
                          </p>
                          <span className="text-xs text-neutral-500 mt-2 block">
                            4 months ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
