'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-lavender-100 border-b border-lavender-200 shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-display text-xl text-lavender-700 font-bold">
          Intelligent Task Planner
        </Link>
        <nav className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-lavender-600" />
                <span className="hidden sm:inline text-lavender-700 font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center px-3 py-1 border border-lavender-300 rounded hover:bg-lavender-200 transition"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded bg-lavender-500 text-white hover:bg-lavender-600 transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
