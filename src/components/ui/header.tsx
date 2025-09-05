"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Calendar, BarChart3, Bell, Search, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function EnhancedHeader() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/dashboard/tasks", label: "Tasks", icon: Calendar },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
  ];

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">TaskFlow</span>
          </Link>
        </div>

        <div className="hidden md:block flex-1 max-w-xl px-4">
          <div className="relative">
            <input type="text" placeholder="Search tasks, notes, and more..." className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="relative">
                <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative" onClick={() => setShowDropdown(false)} aria-label="Notifications">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-xl p-2 transition-colors" onClick={() => setShowDropdown(!showDropdown)} aria-label="Open profile menu">
                  {session.user?.image ? <img src={session.user.image} alt="Profile" className="h-8 w-8 rounded-full" /> : <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium">{session.user?.name?.[0] || 'U'}</div>}
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>

                    <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="h-4 w-4" /><span>Profile</span></Link>
                    <Link href="/settings" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Settings className="h-4 w-4" /><span>Settings</span></Link>
                    <button onClick={() => signOut()} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><LogOut className="h-4 w-4" /><span>Sign out</span></button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/auth/signin" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors">Sign In</Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && session && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="lg:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex items-center space-x-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}