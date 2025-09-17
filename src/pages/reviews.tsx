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

export default function ReviewsPage() {
  // Store current index for carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const images = [1, 2, 3, 4, 5].map(
    (i) => `https://picsum.photos/1200/80${i}`,
  );

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images + Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + Address */}
          <div>
            <h2 className="text-3xl font-bold">
              Warm 30m² studio near Montparnasse
            </h2>
            <p className="text-neutral-400">
              11 rue Didot, 75014 R+2, Paris 75014
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Property ${i + 1}`}
                className="rounded-lg object-cover w-full h-40 cursor-pointer"
                onClick={() => {
                  setCurrentIndex(i);
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
            <h3 className="text-xl font-semibold mb-2">Housing benefits</h3>
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
          </section>

          {/* Reservation Policy */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Reservation policy</h3>
            <p className="text-neutral-300 mb-2">
              This accommodation is rented monthly for a minimum of 30 days. If
              you rent a private room in a shared apartment, only one person is
              allowed per room.
            </p>
            <p className="text-neutral-300">Arrival: from 5:00pm</p>
            <p className="text-neutral-300">Departure: before 10:00am</p>
          </section>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>
                Q1 - Is it possible to make a visit?
              </AccordionTrigger>
              <AccordionContent>No, visits are not possible.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Q2 - Is bed linen included?</AccordionTrigger>
              <AccordionContent>Yes, sheets are included.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column - Booking Summary */}
        <aside className="lg:col-span-1">
          <Card className="bg-neutral-800 sticky top-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Summary</h3>
              <p>
                Arrival: <span className="font-medium">September 17</span>
              </p>
              <p>
                Departure: <span className="font-medium">October 17</span>
              </p>
              <div className="border-t border-neutral-700 my-2"></div>
              <p className="text-lg">Studio</p>
              <p className="text-neutral-400">2200€ per month</p>
              <p className="text-neutral-400">2290€ total (incl. fees)</p>
              <Button className="w-full bg-lime-500 hover:bg-lime-600 text-black">
                Reserve
              </Button>
              <p className="text-xs text-neutral-500 text-center">
                No amount will be charged at this time.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
