export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lavender-50 animate-fadeIn text-center">
      <div className="text-7xl mb-4 text-lavender-200 font-bold">404</div>
      <h2 className="font-display text-2xl text-lavender-700 mb-2">Page Not Found</h2>
      <p className="text-lavender-500">The page you’re looking for doesn’t exist or was moved.</p>
      <a href="/" className="mt-6 inline-block text-lavender-500 underline hover:text-lavender-700 transition">Go Home</a>
    </div>
  );
}
