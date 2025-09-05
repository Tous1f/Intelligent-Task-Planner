'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  LearningPattern,
  CognitiveLoad,
  StudySession
} from '@/types/ai-insights';

interface ProductivityTrend {
  date: Date;
  productivity: number;
}

interface AIInsightProps {
  insights: string[];
  type: 'success' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
}

const AIInsightCard = ({ insights, type, icon, title }: AIInsightProps) => (
  <Card className="p-6">
    <div className="flex items-start space-x-4">
      <div className={`
        p-3 rounded-xl
        ${type === 'success' ? 'bg-green-100 text-green-600' :
          type === 'warning' ? 'bg-orange-100 text-orange-600' :
          'bg-blue-100 text-blue-600'}
      `}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="text-muted-foreground">
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
);

export default function AIInsightsDashboard() {
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoad | null>(null);
  const [productivityTrends, setProductivityTrends] = useState<{
    trends: ProductivityTrend[];
    insights: string[];
    suggestions: string[];
  } | null>(null);
  const [burnoutRisk, setBurnoutRisk] = useState<{
    riskLevel: number;
    factors: string[];
    preventiveActions: string[];
  } | null>(null);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const [patternsRes, trendsRes, burnoutRes] = await Promise.all([
        fetch('/api/ai/insights/patterns'),
        fetch('/api/ai/insights/productivity'),
        fetch('/api/ai/insights/burnout')
      ]);

      const [patternsData, trendsData, burnoutData] = await Promise.all([
        patternsRes.json(),
        trendsRes.json(),
        burnoutRes.json()
      ]);

      setPatterns(patternsData.patterns);
      setProductivityTrends(trendsData);
      setBurnoutRisk(burnoutData);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductivityChart = () => {
    if (!productivityTrends?.trends) return null;

    const maxProductivity = Math.max(...productivityTrends.trends.map(t => t.productivity));
    
    return (
      <div className="h-40 flex items-end space-x-1">
        {productivityTrends.trends.map((trend, index) => (
          <div
            key={index}
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 transition-all rounded-t"
            style={{
              height: `${(trend.productivity / maxProductivity) * 100}%`
            }}
            title={`${new Date(trend.date).toLocaleDateString()}: ${trend.productivity.toFixed(1)}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Learning Insights</h1>
        <p className="text-muted-foreground">
          Your personalized learning analytics and recommendations
        </p>
      </div>

      {/* Burnout Risk Indicator */}
      {burnoutRisk && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Burnout Risk Assessment</h2>
            <div className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${burnoutRisk.riskLevel > 0.7 ? 'bg-red-100 text-red-700' :
                burnoutRisk.riskLevel > 0.4 ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'}
            `}>
              {burnoutRisk.riskLevel > 0.7 ? 'High Risk' :
                burnoutRisk.riskLevel > 0.4 ? 'Moderate Risk' :
                'Low Risk'}
            </div>
          </div>
          <Progress 
            value={burnoutRisk.riskLevel * 100}
            className={`h-2 mb-4
              ${burnoutRisk.riskLevel > 0.7 ? 'bg-red-500' :
                burnoutRisk.riskLevel > 0.4 ? 'bg-orange-500' :
                'bg-green-500'}
            `}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Contributing Factors</h3>
              <ul className="space-y-2">
                {burnoutRisk.factors.map((factor, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Preventive Actions</h3>
              <ul className="space-y-2">
                {burnoutRisk.preventiveActions.map((action, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-green-500" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Productivity Trends */}
        {productivityTrends && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Productivity Trends</h2>
            {renderProductivityChart()}
            <div className="mt-4 space-y-4">
              {productivityTrends.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-1" />
                  <p className="text-sm text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Learning Pattern Analysis */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Pattern Analysis</h2>
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {pattern.subjectArea}
                  </span>
                  <span className="text-sm font-medium">
                    {pattern.productivity.toFixed(1)}/5
                  </span>
                </div>
                <Progress value={pattern.productivity * 20} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={() => {/* Implement optimal time finder */}}
        >
          <Clock className="w-4 h-4" />
          <span>Find Optimal Study Time</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={() => {/* Implement strategy generator */}}
        >
          <Target className="w-4 h-4" />
          <span>Generate Study Strategy</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={fetchAIInsights}
        >
          <Brain className="w-4 h-4" />
          <span>Refresh Insights</span>
        </Button>
      </div>
    </div>
  );
}
