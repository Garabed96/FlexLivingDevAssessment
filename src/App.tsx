import {
  createRouter,
  createRoute,
  createRootRouteWithContext,
  RouterProvider,
} from '@tanstack/react-router';
import DashboardPage from '@/pages/dashboard.tsx';
import React from 'react';
import { RootLayout } from '@/components/RootLayout.tsx';
import { ReviewsPage } from '@/pages/property-details.tsx';
import { PropertysPage } from '@/pages/properties.tsx';

// 1. Update the root route to use our layout component
const rootRoute = createRootRouteWithContext()({
  component: RootLayout,
});

// 2. Create the specific routes for our pages
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reviews',
  component: ReviewsPage,
});

// 3. Create the properties parent route (no component, just a container)
const propertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'properties',
});

// 4. Create the PropertysPage index route (shows PropertyReviewsPage at /properties)
const propertiesIndexRoute = createRoute({
  getParentRoute: () => propertiesRoute,
  path: '/',
  component: PropertysPage,
});

// 5. Create the property detail route (shows Propertys at /properties/$propertyName)
const propertyDetailRoute = createRoute({
  getParentRoute: () => propertiesRoute,
  path: '$propertyName',
  component: ReviewsPage,
});

// 6. Create the route tree with a nested structure
const routeTree = rootRoute.addChildren([
  indexRoute,
  reviewsRoute,
  propertiesRoute.addChildren([propertiesIndexRoute, propertyDetailRoute]),
]);

// 7. Create the router instance
const router = createRouter({ routeTree, scrollRestoration: true });

// 8. Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Our main App component renders the router provider
function App() {
  return <RouterProvider router={router} />;
}

export default App;
