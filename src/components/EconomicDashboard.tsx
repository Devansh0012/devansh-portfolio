"use client";

/**
 * Economic Impact Dashboard - Visualize engineering impact in economic terms
 * Features:
 * - Animated metric cards with trend indicators
 * - Visual charts for cost savings and efficiency
 * - Real-time style updates
 * - Economic terminology for engineering metrics
 * 
 * HCI Principles:
 * - Metaphor: Financial dashboard familiar to business stakeholders
 * - Feedback: Animated counters and trend arrows
 * - Hierarchy: Most important metrics emphasized
 * - Scannability: Quick visual indicators
 */

import { useState, useEffect, useRef } from "react";
import { economicImpactMetrics } from "@/lib/sports-achievements-data";
import type { EconomicMetric } from "@/lib/polymath-data";
import { 
  TrendingUp, TrendingDown, Minus, DollarSign, 
  Zap, Target, BarChart3, PieChart, Activity 
} from "lucide-react";

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = end * easeOut;
      
      setCount(decimals > 0 
        ? parseFloat(currentValue.toFixed(decimals))
        : Math.floor(currentValue)
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration, decimals]);

  return { count, ref };
}

// Trend indicator component
function TrendIndicator({ trend, changePercent }: { trend: EconomicMetric['trend']; changePercent?: number }) {
  const icons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  };

  const colors = {
    up: "text-emerald-400",
    down: "text-red-400",
    stable: "text-slate-400",
  };

  const bgColors = {
    up: "bg-emerald-500/10",
    down: "bg-red-500/10",
    stable: "bg-slate-500/10",
  };

  const Icon = icons[trend];

  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${bgColors[trend]}`}>
      <Icon className={`h-3 w-3 ${colors[trend]}`} />
      {changePercent !== undefined && (
        <span className={`text-xs font-semibold ${colors[trend]}`}>
          {changePercent > 0 ? '+' : ''}{changePercent}%
        </span>
      )}
    </div>
  );
}

// Metric card component
function MetricCard({ metric }: { metric: EconomicMetric }) {
  const { count, ref } = useCountUp(
    typeof metric.value === 'number' ? metric.value : 0,
    2000,
    metric.unit === '%' ? 1 : 0
  );

  const getIcon = (visualType: string) => {
    switch (visualType) {
      case 'line': return Activity;
      case 'bar': return BarChart3;
      case 'pie': return PieChart;
      case 'gauge': return Target;
      default: return Zap;
    }
  };

  const Icon = getIcon(metric.visualType);

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/20 p-2">
            <Icon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
          </div>
        </div>
        <TrendIndicator trend={metric.trend} changePercent={metric.changePercent} />
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-slate-100">
          {metric.unit === '$' && '$'}
          {count}
          {metric.unit !== '$' && metric.unit}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-400 leading-relaxed">
        {metric.description}
      </p>

      {/* Mini progress bar for visual emphasis */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full transition-all duration-1000 ${
            metric.trend === 'up' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              : metric.trend === 'down'
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : 'bg-gradient-to-r from-slate-500 to-slate-400'
          }`}
          style={{ 
            width: `${typeof metric.value === 'number' ? Math.min(metric.value, 100) : 0}%` 
          }}
        />
      </div>
    </div>
  );
}

export default function EconomicDashboard() {
  const [selectedView, setSelectedView] = useState<'all' | 'cost' | 'performance' | 'value'>('all');

  const filterMetrics = (view: typeof selectedView) => {
    if (view === 'all') return economicImpactMetrics;
    
    const keywords = {
      cost: ['cost', 'savings', 'budget', 'expense'],
      performance: ['performance', 'latency', 'throughput', 'efficiency'],
      value: ['value', 'revenue', 'roi', 'impact'],
    };

    return economicImpactMetrics.filter(metric =>
      keywords[view].some(keyword => 
        metric.label.toLowerCase().includes(keyword) ||
        metric.description.toLowerCase().includes(keyword)
      )
    );
  };

  const displayMetrics = filterMetrics(selectedView);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 mb-4">
          <DollarSign className="h-3 w-3" />
          Economic Impact
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="glow-economics">Engineering in Economic Terms</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Quantifying technical excellence through cost savings, efficiency gains, and business value creation.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { value: 'all', label: 'All Metrics', icon: BarChart3 },
          { value: 'cost', label: 'Cost Savings', icon: DollarSign },
          { value: 'performance', label: 'Performance', icon: Zap },
          { value: 'value', label: 'Value Creation', icon: TrendingUp },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedView(value as typeof selectedView)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedView === value
                ? 'glass-card border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Metrics grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Summary footer */}
      <div className="mt-12 glass-card rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-100 mb-3">
          Bottom Line Impact
        </h3>
        <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
          These metrics translate technical decisions into business outcomes. Every optimization, 
          every architecture choice, every line of code contributes to measurable economic value. 
          Engineering excellence isn&apos;t just about beautiful code—it&apos;s about sustainable, 
          profitable systems that scale.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span>Upward trends indicate improvements</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Minus className="h-4 w-4" />
            <span>Stable metrics maintain excellence</span>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span>Downward trends show reductions in costs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
