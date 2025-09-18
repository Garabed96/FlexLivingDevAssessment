import { Link, Outlet } from '@tanstack/react-router';
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex items-center px-16 py-8 bg-argile-100 text-gray-800 shadow-md">
        <div className="flex items-center gap-10">
          {/* Increased gap for spacing */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-flexliving.svg"
              alt="Flex Living Logo"
              className="h-6 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              className="uppercase font-semibold text-sm tracking-wider [&.active]:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/properties"
              className="uppercase font-semibold text-sm tracking-wider [&.active]:text-primary"
            >
              Property Listings
            </Link>
          </div>
        </div>
      </nav>
      <hr />
      <TooltipProvider>
        <main className="flex-grow overflow-hidden">
          <Outlet />
        </main>
      </TooltipProvider>
    </div>
  );
}
