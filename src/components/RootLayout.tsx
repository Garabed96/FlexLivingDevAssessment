import { Link, Outlet } from '@tanstack/react-router';
import React from 'react';

export function RootLayout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <nav className="flex items-center px-16 py-10 bg-argile-100 text-gray-800 shadow-md">
        <div className="flex items-center gap-10">
          {' '}
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
              to="/reviews"
              className="uppercase font-semibold text-sm tracking-wider [&.active]:text-primary"
            >
              Public Reviews
            </Link>
          </div>
        </div>
      </nav>
      <hr />
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
