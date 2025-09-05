"use client";

import Link from "next/link";
import { Home, Calendar, Clock, Menu, X, LayoutDashboard, BookOpen } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/tasks", icon: Home, label: "Tasks" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/study", icon: BookOpen, label: "Study" },
  { href: "/dashboard/schedule", icon: Clock, label: "Schedule" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn" onClick={() => setOpen(false)} />
        )}

        <div
          className={cn(
            "fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl rounded-tr-2xl z-50 transform transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((nav, i) => {
                const isActive = pathname === nav.href;
                const Icon = nav.icon;

                return (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    onClick={() => setOpen(false)}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{nav.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </nav>
    </>
  );
}

