export default function DashboardLoading() {
  return (
    <div className="h-full flex items-center justify-center bg-lavender-50 animate-fadeIn">
      <div className="w-12 h-12 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin mr-5"></div>
      <span className="text-lavender-700 text-lg">Loading your dashboard...</span>
    </div>
  );
}
