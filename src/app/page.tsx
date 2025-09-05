'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button, Card, FeatureCard } from '@/components/ui/exports';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Brain, 
  Calendar, 
  Clock, 
  Sparkles, 
  Target, 
  Zap,
  ChevronRight,
  ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const features: Feature[] = [
  {
    title: 'Smart Task Planning',
    description: 'AI-powered task organization and scheduling that adapts to your workflow.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Intelligent Calendar',
    description: 'Seamless calendar integration with smart conflict resolution and scheduling.',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Focus Timer',
    description: 'Enhanced focus sessions with intelligent break scheduling and tracking.',
    icon: Clock,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Goal Tracking',
    description: 'Set, track, and achieve your goals with AI-driven insights and recommendations.',
    icon: Target,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Study Optimization',
    description: 'Optimize your study sessions with spaced repetition and smart scheduling.',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Productivity Analytics',
    description: 'Deep insights into your productivity patterns and personalized recommendations.',
    icon: Zap,
    color: 'from-pink-500 to-rose-500'
  }
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-accent/10 mask-fade-out pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-8">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Intelligent Task Planning
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Plan smarter, achieve more with AI-powered task management
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    variant="primary"
                    className={cn("group", "flex items-center gap-2")}
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent mb-4">
              Supercharge Your Productivity
            </h2>
            <p className="text-lg text-muted-foreground dark:text-slate-400">
              Everything you need to maximize your efficiency and achieve your goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={cn(
                    "absolute -top-6 left-6",
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-br", feature.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    className="pt-8"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-accent-50/50 dark:bg-accent-950/50 border border-border/50 dark:border-white/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-accent/10 mask-fade-out" />
            <div className="relative p-8 md:p-12 text-center">
              <motion.div
                className="max-w-3xl mx-auto space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                  Ready to Transform Your Productivity?
                </h3>
                <p className="text-lg text-muted-foreground dark:text-slate-400">
                  Join thousands of users who have revolutionized their workflow with our intelligent task planner.
                </p>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    variant="primary"
                    className={cn("group", "flex items-center gap-2")}
                  >
                    <span>Start Your Journey</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
