export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lavender-50 animate-fadeIn">
      <div className="w-16 h-16 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin mb-6"></div>
      <p className="text-lavender-700 text-lg">Loading...</p>
    </div>
  );
}
