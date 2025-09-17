import {
  createRouter,
  createRoute,
  createRootRouteWithContext,
  RouterProvider,
} from '@tanstack/react-router';
import DashboardPage from '@/pages/dashboard.tsx';
import React from 'react';
import { RootLayout } from '@/components/RootLayout.tsx';

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

// Create a placeholder for the public reviews page
const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reviews',
  component: function PublicReviews() {
    return <div className="p-2">Public Reviews Page - Coming Soon!</div>;
  },
});

// 3. Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, reviewsRoute]);

// 4. Create the router instance
const router = createRouter({ routeTree, scrollRestoration: true });

// 5. Register the router instance for type safety
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
