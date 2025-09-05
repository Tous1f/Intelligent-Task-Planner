'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageCircle, 
  Shield, 
  FileText, 
  Github, 
  Twitter, 
  Linkedin, 
  Heart,
  Sparkles,
  ArrowUp
} from 'lucide-react';
import { useState } from 'react';

export default function EnhancedFooter() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  // Show back to top button when scrolled
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowBackToTop(window.scrollY > 400);
    });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { href: '/tasks', label: 'My Tasks', icon: '✅' },
        { href: '/calendar', label: 'Calendar', icon: '📅' },
        { href: '/insights', label: 'AI Insights', icon: '🧠' },
        { href: '/pomodoro', label: 'Focus Timer', icon: '⏰' },
      ]
    },
    {
      title: 'Features',
      links: [
        { href: '/features/ai-planning', label: 'AI Task Planning', icon: '🤖' },
        { href: '/features/smart-scheduling', label: 'Smart Scheduling', icon: '📊' },
        { href: '/features/productivity-tracking', label: 'Progress Tracking', icon: '📈' },
        { href: '/features/study-sessions', label: 'Study Sessions', icon: '📚' },
        { href: '/features/calendar-sync', label: 'Calendar Sync', icon: '🔄' },
      ]
    },
    {
      title: 'Support',
      links: [
        { href: '/help', label: 'Help Center', icon: '❓' },
        { href: '/contact', label: 'Contact Us', icon: '💬' },
        { href: '/privacy', label: 'Privacy Policy', icon: '🔒' },
        { href: '/terms', label: 'Terms of Service', icon: '📋' },
        { href: '/feedback', label: 'Send Feedback', icon: '💭' },
      ]
    }
  ];

  const socialLinks = [
    { href: 'https://github.com', icon: Github, label: 'GitHub', color: 'hover:text-gray-900' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', color: 'hover:text-blue-500' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white rounded-full shadow-lg hover:shadow-xl z-40 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <footer className="bg-gradient-to-br from-lavender-900 via-lavender-800 to-lavender-900 text-lavender-100 mt-auto relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-lavender-300 to-lavender-500"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white font-bold text-xl">🎯</span>
                </motion.div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-lavender-200">
                    Intelligent Task Planner
                  </h3>
                  <p className="text-sm text-lavender-400 font-medium">
                    Smart Productivity Assistant
                  </p>
                </div>
              </div>
              
              <p className="text-lavender-300 leading-relaxed mb-6 max-w-sm">
                AI-powered task planning designed specifically for university students. 
                Smart scheduling, productivity insights, and seamless workflow optimization.
              </p>

              <div className="flex items-center space-x-2 text-sm text-lavender-400 mb-6">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Made with</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>for students by students</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-lavender-800 hover:bg-lavender-700 flex items-center justify-center transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
              >
                <h4 className="font-heading font-semibold text-lg text-lavender-200 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-lavender-400 rounded-full mr-3"></span>
                  {section.title}
                </h4>
                
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={link.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="text-lavender-300 hover:text-lavender-100 transition-all duration-300 text-sm flex items-center group"
                        >
                          <span className="mr-3 group-hover:scale-110 transition-transform">
                            {link.icon}
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            className="mt-16 pt-8 border-t border-lavender-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-xl font-bold text-lavender-200 mb-4">
                Stay Updated with New Features
              </h4>
              <p className="text-lavender-300 mb-6">
                Get notified about new AI features, productivity tips, and updates.
              </p>
              
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-l-2xl bg-lavender-800 border border-lavender-600 text-lavender-100 placeholder-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold rounded-r-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="mt-12 pt-8 border-t border-lavender-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-lavender-400">
                © {currentYear} Intelligent Task Planner. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-8 text-xs text-lavender-500">
                <div className="flex items-center space-x-2">
                  <span>Made for</span>
                  <span className="bg-gradient-to-r from-lavender-400 to-lavender-600 bg-clip-text text-transparent font-semibold">
                    NSU CSE327 Project
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <span>Powered by</span>
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-lavender-400 font-medium">Next.js</span>
                    <span className="text-lavender-600">•</span>
                    <span className="text-lavender-400 font-medium">Prisma</span>
                    <span className="text-lavender-600">•</span>
                    <span className="text-lavender-400 font-medium">Google AI</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}