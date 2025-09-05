import { Metadata } from 'next';
import Sidebar from '@/components/ui/sidebar';
import Header from '@/components/ui/header';

export const metadata: Metadata = {
  title: 'Dashboard | Intelligent Task Planner',
  description: 'Your personalized study dashboard with AI-powered insights',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    {
      title: 'AI Insights',
      href: '/dashboard/ai-insights',
      icon: '🧠',
      description: 'View personalized AI recommendations and insights',
    },
    {
      title: 'Tasks',
      href: '/dashboard/tasks',
      icon: '✅',
      description: 'Manage your study tasks and assignments',
    },
    {
      title: 'Calendar',
      href: '/dashboard/calendar',
      icon: '📅',
      description: 'View and manage your schedule',
    },
    {
      title: 'Study',
      href: '/dashboard/study',
      icon: '📚',
      description: 'Start focused study sessions',
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: '📊',
      description: 'Track your study progress and patterns',
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: '⚙️',
      description: 'Configure your preferences',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar items={navItems} className="hidden lg:block" />
        <main className="flex-1 pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
