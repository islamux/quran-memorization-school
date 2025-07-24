'use client';

import Error from 'next/error';

// Render the default Next.js 404 page when a route
// is requested that doesn't match any other pages
export default function NotFound() {
  return <Error statusCode={404} />;
}
