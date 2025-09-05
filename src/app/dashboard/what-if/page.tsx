'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BarChart3, AlertTriangle, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface ScenarioResult {
  completionProbability: number;
  stressLevel: number;
  productivityScore: number;
  recommendations: string[];
  risks: string[];
  timelineAdjustments: Array<{
    taskId: string;
    originalDate: Date;
    suggestedDate: Date;
    reason: string;
  }>;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WhatIfPage() {
  const [loading, setLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'schedule' | 'workload' | 'impact' | null>(null);
  const [results, setResults] = useState<ScenarioResult | null>(null);

  const analyzeScenario = async (type: 'schedule' | 'workload' | 'impact') => {
    setLoading(true);
    setActiveScenario(type);

    try {
      const response = await fetch('/api/ai/what-if/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioType: type,
          params: {
            // Add scenario-specific parameters here
          }
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-heading font-bold mb-3 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
          What-If Scenario Planning
        </h1>
        <p className="text-muted-foreground dark:text-slate-400">
          Explore different schedule scenarios and optimize your study plan
        </p>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Schedule Simulation Card */}
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent-50/50 dark:bg-accent-950/50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent mb-2">
                  Schedule Simulation
                </h3>
                <p className="text-muted-foreground dark:text-slate-400 mb-4">
                  Test different schedule arrangements and see how they affect your productivity.
                </p>
                <Button 
                  variant="default"
                  className="w-full justify-center"
                  onClick={() => analyzeScenario('schedule')}
                  disabled={loading && activeScenario === 'schedule'}
                >
                  {loading && activeScenario === 'schedule' ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Run Simulation'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Workload Analysis Card */}
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent-50/50 dark:bg-accent-950/50 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent mb-2">
                  Workload Analysis
                </h3>
                <p className="text-muted-foreground dark:text-slate-400 mb-4">
                  Analyze your current workload distribution and find optimization opportunities.
                </p>
                <Button 
                  variant="default"
                  className="w-full justify-center"
                  onClick={() => analyzeScenario('workload')}
                  disabled={loading && activeScenario === 'workload'}
                >
                  {loading && activeScenario === 'workload' ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Analyze Workload'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Impact Assessment Card */}
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent-50/50 dark:bg-accent-950/50 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent mb-2">
                  Impact Assessment
                </h3>
                <p className="text-muted-foreground dark:text-slate-400 mb-4">
                  Evaluate how changes to your schedule impact your long-term goals.
                </p>
                <Button 
                  variant="default"
                  className="w-full justify-center"
                  onClick={() => analyzeScenario('impact')}
                  disabled={loading && activeScenario === 'impact'}
                >
                  {loading && activeScenario === 'impact' ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Assess Impact'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
              <div className="space-y-6">
                {/* Completion Probability */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Completion Probability</span>
                    <span className="text-sm font-medium">{results.completionProbability}%</span>
                  </div>
                  <Progress value={results.completionProbability} />
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                {results.risks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Potential Risks</h3>
                    <ul className="space-y-2">
                      {results.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
