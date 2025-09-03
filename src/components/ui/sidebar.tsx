'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Clock,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/timer', label: 'Pomodoro Timer', icon: Clock },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-lavender-100 min-h-screen p-6 flex flex-col justify-between">
      <nav className="flex flex-col space-y-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-lavender-500 text-white'
                  : 'text-lavender-700 hover:bg-lavender-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {session && (
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 bg-lavender-500 text-white py-2 px-4 rounded hover:bg-lavender-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      )}
    </aside>
  );
}
