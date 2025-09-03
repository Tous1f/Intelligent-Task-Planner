'use client';

export default function GlobalError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lavender-50 animate-fadeIn">
      <span className="text-5xl mb-2 text-lavender-600">⚠️</span>
      <h1 className="font-display text-2xl text-lavender-700 mb-3">Something went wrong</h1>
      <p className="text-lavender-500 mb-4">Sorry, we couldn't load this page. Please try again or contact support.</p>
      <a href="/" className="text-lavender-500 underline hover:text-lavender-700 transition">Back to Home</a>
    </div>
  );
}
