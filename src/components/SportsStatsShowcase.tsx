"use client";

/**
 * Sports Stats Showcase - Career achievements displayed like athlete statistics
 * Features:
 * - Player card with overall rating (FIFA/NBA style)
 * - Career stats dashboard with multiple metrics
 * - Season-by-season progression
 * - Achievement badges and trophies
 * - Animated stat reveals
 *
 * HCI Principles:
 * - Metaphor: Uses familiar sports UI patterns
 * - Hierarchy: Clear organization of information
 * - Progressive disclosure: Details on demand
 * - Visual feedback: Animated counters and progress bars
 */

import { useState, useEffect, useRef } from "react";
import {
  careerStats,
  sportsAchievements,
  seasonStats,
  getPlayerCard,
} from "@/lib/sports-achievements-data";
import type { SportsAchievement } from "@/lib/polymath-data";
import {
  Trophy, Zap, Target, Shield, TrendingUp, Award,
  ChevronRight, Star, ArrowUp, ArrowDown, Minus,
} from "lucide-react";

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
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
      setCount(Math.floor(start + (end - start) * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration, start]);

  return { count, ref };
}

// Rating attribute bar
function AttributeBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100;
  const color = value >= 90 ? "emerald" : value >= 80 ? "blue" : value >= 70 ? "amber" : "slate";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-24 text-right uppercase tracking-wide">
        {label}
      </span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-bold text-slate-200 w-8">{value}</span>
    </div>
  );
}

// Achievement badge component
function AchievementBadge({ achievement }: { achievement: SportsAchievement }) {
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "hackathons":
        return "badge-gold";
      case "projects":
        return "badge-silver";
      case "contributions":
        return "badge-bronze";
      default:
        return "badge-silver";
    }
  };

  return (
    <div className="stat-card group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`${getBadgeStyle(achievement.category)} p-3 rounded-lg`}>
          <Trophy className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-slate-200 text-sm mb-1">
            {achievement.achievement}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-400">{achievement.statValue}</span>
            <span className="text-xs text-slate-500">{achievement.stat}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic">
            {achievement.comparison}
          </p>
          <div className="mt-2">
            <span className="text-xs text-amber-400">{achievement.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SportsStatsShowcase() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "achievements" | "seasons">("overview");
  const playerCard = getPlayerCard();

  // Animated overall rating
  const { count: ratingCount, ref: ratingRef } = useCountUp(playerCard.overallRating);

  return (
    <div className="w-full space-y-8">
      {/* Section header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="glow-sports">Career Stats</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Performance metrics presented like an elite athlete&apos;s career dashboard
        </p>
      </div>

      {/* Player Card (FIFA/NBA style) */}
      <div className="scoreboard rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-8">
          {/* Left: Player info and rating */}
          <div className="flex items-center gap-6">
            <div
              ref={ratingRef}
              className="flex flex-col items-center justify-center w-28 h-28 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/50"
            >
              <span className="text-5xl font-black text-amber-400">{ratingCount}</span>
              <span className="text-xs text-amber-400/70 uppercase font-semibold mt-1">
                Overall
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-1">{playerCard.name}</h3>
              <p className="text-amber-400 font-semibold mb-3">{playerCard.position}</p>

              <div className="flex flex-wrap gap-2">
                {playerCard.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                  <span>{playerCard.skillMoves} Skills</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-blue-400" />
                  <span>{playerCard.weakFoot} Versatility</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Attributes */}
          <div className="space-y-2.5">
            <AttributeBar label="Pace" value={playerCard.attributes.pace} />
            <AttributeBar label="Shooting" value={playerCard.attributes.shooting} />
            <AttributeBar label="Passing" value={playerCard.attributes.passing} />
            <AttributeBar label="Dribbling" value={playerCard.attributes.dribbling} />
            <AttributeBar label="Defending" value={playerCard.attributes.defending} />
            <AttributeBar label="Physical" value={playerCard.attributes.physical} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 glass-card rounded-lg p-1 max-w-md mx-auto">
        {[
          { id: "overview", label: "Overview", icon: TrendingUp },
          { id: "achievements", label: "Achievements", icon: Trophy },
          { id: "seasons", label: "Seasons", icon: Award },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedTab(id as typeof selectedTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${
              selectedTab === id
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/30"
            }`}
            aria-current={selectedTab === id ? "page" : undefined}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {selectedTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up">
            {/* Offensive stats */}
            <StatCard
              label="Features Shipped"
              value={careerStats.offensive.goalsValue}
              sublabel="Major launches"
              icon={<Zap className="w-5 h-5 text-amber-400" />}
              trend="up"
            />
            <StatCard
              label="PRs Merged"
              value={careerStats.offensive.shotsOnTargetValue}
              sublabel="Code contributions"
              icon={<Target className="w-5 h-5 text-blue-400" />}
              trend="up"
            />

            {/* Defensive stats */}
            <StatCard
              label="Uptime"
              value={`${(careerStats.advanced.passCompletionValue * 100).toFixed(1)}%`}
              sublabel="System reliability"
              icon={<Shield className="w-5 h-5 text-emerald-400" />}
              trend="up"
            />
            <StatCard
              label="Deployments"
              value={careerStats.overall.gamesPlayedValue}
              sublabel="Production releases"
              icon={<TrendingUp className="w-5 h-5 text-violet-400" />}
              trend="up"
            />

            {/* Advanced metrics */}
            <StatCard
              label="Win Rate"
              value={`${(careerStats.overall.winPercentage * 100).toFixed(0)}%`}
              sublabel="Success rate"
              icon={<Trophy className="w-5 h-5 text-amber-400" />}
              trend="up"
            />
            <StatCard
              label="Code Efficiency"
              value={careerStats.advanced.efficiencyValue}
              sublabel="Less is more"
              icon={<ArrowDown className="w-5 h-5 text-emerald-400" />}
              trend="up"
            />
            <StatCard
              label="Bugs Caught"
              value={careerStats.defensive.tacklesValue}
              sublabel="In code review"
              icon={<Shield className="w-5 h-5 text-blue-400" />}
              trend="up"
            />
            <StatCard
              label="Cost Savings"
              value="45%"
              sublabel="Avg per project"
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              trend="up"
            />
          </div>
        )}

        {selectedTab === "achievements" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in-up">
            {sportsAchievements.slice(0, 9).map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}

        {selectedTab === "seasons" && (
          <div className="space-y-6 fade-in-up">
            {seasonStats.map((season, idx) => (
              <div key={season.season} className="glass-card rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-200 mb-1">
                      {season.season}
                    </h3>
                    <p className="text-sm text-blue-400 font-semibold">{season.team}</p>
                    <p className="text-xs text-slate-500 mt-1">{season.role}</p>
                  </div>
                  <div className={`badge ${idx === 0 ? "badge-gold" : "badge-silver"}`}>
                    {idx === 0 ? "Current" : "Past"}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {season.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Season stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-700/50">
                  {Object.entries(season.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{value}</div>
                      <div className="text-xs text-slate-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat card component
function StatCard({
  label,
  value,
  sublabel,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  sublabel: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}) {
  const { count, ref } = useCountUp(typeof value === "number" ? value : 0);

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-500";

  return (
    <div ref={ref} className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>

      <div className="stat-value">
        {typeof value === "number" ? count : value}
      </div>
      <div className="stat-label mt-2">{label}</div>
      <p className="text-xs text-slate-500 mt-1">{sublabel}</p>
    </div>
  );
}
