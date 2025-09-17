import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router';
import DashboardPage from '@/pages/dashboard.tsx';
import React from 'react';

// 1. Create a root route. This is the top-level layout of our app.
const rootRoute = createRootRoute();

// 2. Create the specific routes for our pages
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// 3. Create the route tree
const routeTree = rootRoute.addChildren([dashboardRoute]);

// 4. Create the router instance
const router = createRouter({ routeTree });

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
