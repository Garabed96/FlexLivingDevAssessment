import React from 'react';
import { useGetReviews } from '@/api/reviews';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Wifi, Car } from 'lucide-react';

// Generate consistent random image for each property based on property name
const getPropertyImage = (propertyName) => {
  // Use property name to generate consistent seed for same image each time
  const seed = propertyName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const imageId = (seed % 1000) + 100; // Ensures 3-digit number between 100-1099
  return `https://picsum.photos/400/250?random=${imageId}`;
};

// Mock function to get property type and details (you can replace with real data)
const getPropertyDetails = (propertyName) => {
  const types = ['Studio', 'Apartment', 'House', 'Loft', 'Villa'];
  const locations = [
    'Paris 14th',
    'Paris 11th',
    'Paris 18th',
    'Paris 7th',
    'Paris 3rd',
  ];
  const amenities = [
    ['Wifi', 'Kitchen', 'Heating'],
    ['Wifi', 'Parking', 'Garden'],
    ['Wifi', 'Balcony', 'Washing Machine'],
    ['Wifi', 'Elevator', 'Furnished'],
  ];

  const seed = propertyName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  return {
    type: types[seed % types.length],
    location: locations[seed % locations.length],
    price: Math.floor((seed % 1000) + 800), // Price between 800-1799
    rating: (3.5 + (seed % 15) / 10).toFixed(1), // Rating between 3.5-5.0
    reviews: Math.floor((seed % 50) + 10), // Review count between 10-59
    amenities: amenities[seed % amenities.length],
  };
};

// Main component to display a list of all properties with published reviews
export function PropertysPage() {
  const { data: reviews, isLoading } = useGetReviews();

  const properties = React.useMemo(() => {
    if (!reviews) return [];
    // First, get all reviews that are successfully published
    const published = reviews.filter((r) => r.status === 'success');
    // Then, get the unique names of the properties from that list
    const propertyNames = [...new Set(published.map((r) => r.listingName))];
    return propertyNames.sort();
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-4 space-y-4"
                >
                  <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Left Sidebar - Properties List */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col">
        {/* Header Section */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
          <div className="px-6 py-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Discover Your Perfect Stay
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400">
                {properties.length} premium properties available
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Properties List */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {properties.map((name) => {
              const details = getPropertyDetails(name);

              return (
                <Link
                  key={name}
                  to="/properties/$propertyName"
                  params={{ propertyName: encodeURIComponent(name) }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white dark:bg-neutral-800 h-80 flex flex-col">
                    {/* Property Image */}
                    <div className="relative overflow-hidden flex-shrink-0">
                      <img
                        src={getPropertyImage(name)}
                        alt={name}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Price Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-neutral-900 font-semibold shadow-lg backdrop-blur-sm">
                          €{details.price}/month
                        </Badge>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant="secondary"
                          className="bg-neutral-900/80 text-white font-medium"
                        >
                          {details.type}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      {/* Property Name & Location */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-neutral-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4 text-neutral-500" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {details.location}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Section - Rating & Amenities */}
                      <div className="space-y-2">
                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm text-neutral-900 dark:text-white">
                            {details.rating}
                          </span>
                          <span className="text-sm text-neutral-500">
                            ({details.reviews} reviews)
                          </span>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2">
                          {details.amenities.slice(0, 3).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              {amenity === 'Wifi' && (
                                <Wifi className="h-3 w-3 text-neutral-500" />
                              )}
                              {amenity === 'Parking' && (
                                <Car className="h-3 w-3 text-neutral-500" />
                              )}
                              {amenity === 'Kitchen' && (
                                <Users className="h-3 w-3 text-neutral-500" />
                              )}
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                {amenity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {properties.length === 0 && (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  No Properties Available
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  There are currently no published properties to display. Check
                  back soon for new listings!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Map Area */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=2.2945%2C48.8566%2C2.3708%2C48.8848&layer=mapnik&marker=48.8606%2C2.3376"
          className="w-full h-full border-0"
          title="Paris Map"
          allowFullScreen
        />
      </div>
    </div>
  );
}
