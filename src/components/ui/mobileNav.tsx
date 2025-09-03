'use client';

import Link from 'next/link';
import { Home, Calendar, Clock, Menu, LayoutDashboard, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/tasks', icon: Home, label: 'Tasks' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/dashboard/study', icon: BookOpen, label: 'Study' },
  { href: '/dashboard/schedule', icon: Clock, label: 'Schedule' }
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-lavender-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((nav) => {
          const isActive = pathname === nav.href;
          return (
            <Link
              key={nav.href}
              href={nav.href}
              className={`flex flex-col items-center flex-1 py-1 transition text-sm ${
                isActive
                  ? 'text-lavender-600 font-semibold'
                  : 'text-lavender-400 hover:text-lavender-700'
              }`}
            >
              <nav.icon className="w-5 h-5 mb-1" />
              {nav.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
