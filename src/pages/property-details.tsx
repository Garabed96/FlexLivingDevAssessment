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
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Faqs } from '@/faqs.ts'; // Mock FAQ data
import { useParams } from '@tanstack/react-router';
import { useGetReviews } from '@/api/reviews';

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
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Title + Address - Full Width */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{propertyData.listingName}</h2>
          <p className="text-neutral-500 text-lg">{propertyData.type}</p>
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
              <ul className="list-disc list-inside text-neutral-300">
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
              <Card className="bg-neutral-800">
                <CardContent className="p-4 flex items-center gap-4">
                  <img
                    src="https://picsum.photos/200/150"
                    alt="Room"
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Studio</p>
                    <p className="text-neutral-400">2200€ / month</p>
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
              <div className="text-md text-neutral-300 mb-2">Services</div>
              <ul className="grid grid-cols-2 gap-2 text-neutral-300">
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
              <p className="text-neutral-300 mt-2 mb-8">
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
              <p className="text-neutral-300 mb-2">
                This accommodation is rented monthly for a minimum period of 30
                days. If you rent a private room in a shared apartment, only one
                person is allowed per room, additional companions are not
                allowed. If you rent a studio or a T2, then you have private
                accommodation that can accommodate up to two people.
              </p>
              <div className="grid grid-cols-2 gap-4 text-neutral-300">
                <div>
                  <p className="font-semibold">Arrival</p>
                  <p>Arrival time</p>
                  <p className="text-neutral-300">from 5:00pm</p>
                </div>
                <div>
                  <p className="font-semibold">Departure</p>
                  <p>Departure time</p>
                  <p className="text-neutral-300">before 10:00am</p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Modification of reservation policy
              </h2>
              <p className="text-neutral-300 mb-2 text-sm">
                Reservations can be canceled free of charge 30 days before the
                start date of the stay. If the stay is in progress, cancellation
                is possible with 30 days' notice. Extensions of stays are done
                online, our teams are at your disposal for any additional
                questions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
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
              <Card className="bg-neutral-800 border-neutral-700">
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
          </div>
        </div>
      </main>
    </div>
  );
}
