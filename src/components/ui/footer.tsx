'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lavender-900 text-lavender-100 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <span className="font-heading font-bold text-xl text-lavender-200">
                Intelligent Task Planner
              </span>
            </div>
            <p className="text-lavender-300 max-w-md leading-relaxed">
              AI-powered task planning designed specifically for university students. 
              Smart scheduling, productivity insights, and seamless calendar integration.
            </p>
            <div className="mt-4">
              <p className="text-sm text-lavender-400">
                Built with ❤️ for students by students
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lavender-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  My Tasks
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  AI Insights
                </Link>
              </li>
              <li>
                <Link href="/pomodoro" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Pomodoro Timer
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-semibold text-lavender-200 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@taskplanner.edu" 
                  className="text-lavender-300 hover:text-lavender-100 transition-colors text-sm"
                >
                  support@taskplanner.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-lavender-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-lavender-400">
            © {currentYear} Intelligent Task Planner. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="text-xs text-lavender-500">
              Made for NSU CSE327 Project
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-lavender-500">Powered by</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-lavender-400">Next.js</span>
                <span className="text-lavender-600">•</span>
                <span className="text-xs text-lavender-400">Prisma</span>
                <span className="text-lavender-600">•</span>
                <span className="text-xs text-lavender-400">Google AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}