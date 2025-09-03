'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { User, Bell, Calendar, BookOpen } from 'lucide-react';

export default function SettingsMainPage() {
  const { data: session } = useSession();

  const settingsSections = [
    {
      href: '/dashboard/settings/profile',
      title: 'Profile',
      description: 'Update your name, email, and personal info.',
      icon: <User className="w-6 h-6 text-lavender-500" />,
    },
    {
      href: '/dashboard/settings/notifications',
      title: 'Notifications',
      description: 'Choose notification frequency and methods.',
      icon: <Bell className="w-6 h-6 text-lavender-500" />,
    },
    {
      href: '/dashboard/settings/calendar',
      title: 'Calendar',
      description: 'Manage Google Calendar integration and sync.',
      icon: <Calendar className="w-6 h-6 text-lavender-500" />,
    },
    {
      href: '/dashboard/settings/study',
      title: 'Study Preferences',
      description: 'Configure Pomodoro, spaced repetition, and more.',
      icon: <BookOpen className="w-6 h-6 text-lavender-500" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold font-display text-lavender-700 mb-10">
        Settings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="card flex items-center gap-4 hover:bg-lavender-50 transition shadow-md hover:shadow-lg"
          >
            <div className="rounded-lg bg-lavender-100 flex items-center justify-center w-14 h-14">
              {section.icon}
            </div>
            <div>
              <div className="text-lg font-semibold text-lavender-800">{section.title}</div>
              <div className="text-lavender-500 text-sm mt-1">{section.description}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-lavender-400 text-sm text-center">
        Signed in as <span className="font-bold text-lavender-600">{session?.user?.email}</span>
      </div>
    </div>
  );
}
