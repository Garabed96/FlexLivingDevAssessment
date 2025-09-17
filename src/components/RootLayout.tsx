import { Link, Outlet } from '@tanstack/react-router';
import React from 'react';

export function RootLayout() {
  return (
    <>
      <nav className="flex items-center justify-between px-10 py-5 bg-argile-100 text-gray-800 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo-flexliving.svg"
            alt="Flex Living Logo"
            className="h-8 w-auto"
          />
          {/*<span className="font-bold text-lg">Reviews</span>*/}
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <Link to="/" className="[&.active]:font-bold [&.active]:text-primary">
            Dashboard
          </Link>
          <Link
            to="/reviews"
            className="[&.active]:font-bold [&.active]:text-primary"
          >
            Public Reviews
          </Link>
        </div>
      </nav>
      <hr />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
