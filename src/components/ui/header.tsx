"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";

interface HeaderProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  onLogout: () => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export default function Header({ user, onLogout, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="hidden md:block bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
          
          <button
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
