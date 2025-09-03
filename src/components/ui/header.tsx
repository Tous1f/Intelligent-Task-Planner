'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Calendar, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function EnhancedHeader() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/tasks', label: 'Tasks', icon: Calendar },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-lg border-b border-lavender-200/50 shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-xl bg-gradient-to-r from-lavender-600 to-lavender-800 bg-clip-text text-transparent">
                  Intelligent Task Planner
                </h1>
                <p className="text-xs text-lavender-500 font-medium">Smart Productivity Assistant</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {session && navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-lavender-600 hover:text-lavender-700 hover:bg-lavender-50 transition-all duration-300 font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-lavender-50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-lavender-700">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-lavender-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-lavender-200/50 py-2"
                      >
                        <div className="px-4 py-3 border-b border-lavender-100">
                          <p className="font-semibold text-lavender-700">{session.user?.name}</p>
                          <p className="text-sm text-lavender-500">{session.user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-lavender-600 hover:text-lavender-700 hover:bg-lavender-50 transition-all duration-300"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span className="font-medium">Settings</span>
                          </Link>
                          
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-xl text-lavender-600 hover:text-lavender-700 hover:bg-lavender-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && session && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-lavender-200 py-4"
            >
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-lavender-600 hover:text-lavender-700 hover:bg-lavender-50 transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </motion.header>
  );
}