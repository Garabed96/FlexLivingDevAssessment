import { Link, Outlet } from '@tanstack/react-router';
import React from 'react';

export function RootLayout() {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex items-center px-16 py-8 bg-argile-100 text-gray-800 shadow-md">
        <div className="flex items-center gap-10">
          {' '}
          {/* Increased gap for spacing */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-flexliving.svg"
              alt="Flex Living Logo"
              className="h-6 w-auto"
            />
            {/*<img*/}
            {/*  src="https://theflex.global/_next/image?url=https%3A%2F%2Flsmvmmgkpbyqhthzdexc.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fwebsite%2FUploads%2FGreen_V3%2520Symbol%2520%26%2520Wordmark%2520(1).png&w=256&q=75"*/}
            {/*  alt="Flexliving Logo"*/}
            {/*  className="h-10 w-fit mb-5"*/}
            {/*/>*/}
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
