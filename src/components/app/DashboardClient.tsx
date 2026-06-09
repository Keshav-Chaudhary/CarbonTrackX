"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Target,
  Sparkles,
  PlusCircle,
  Activity,
  Leaf,
} from "lucide-react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { dailyTotals } from "@/lib/emissions/calculate";
import { BENCHMARKS } from "@/lib/insights/analyze";
import { useFootprint } from "@/components/app/useFootprint";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { InsightList } from "@/components/app/InsightList";
import { ActivityList } from "@/components/app/ActivityList";

import { BreakdownChart } from "@/components/charts/BreakdownChart";
import { TrendChart } from "@/components/charts/TrendChart";
import {

  formatKg,
} from "@/components/ui";
import { DashboardSkeleton } from "@/components/app/Skeletons";

export function DashboardClient() {
  const { hydrated, analysis, activityCount } = useFootprint();
  const activities = useCarbonStore((s) => s.activities);
  const goal = useCarbonStore((s) => s.goal);

  if (!hydrated) return <DashboardSkeleton />;

  if (activityCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 custom-fade-in">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[var(--accent-subtle)] blur-[60px] rounded-full scale-150 animate-pulse-hover pointer-events-none" />
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[var(--r-xl)] border border-[var(--border-strong)] bg-surface-2 shadow-xl">
            <Leaf className="size-10 text-[var(--accent)]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-fg mb-4">
          Ready to track your footprint?
        </h1>
        <p className="max-w-md text-lg text-fg-muted mb-10 leading-relaxed">
          You haven&apos;t logged any activities yet. Start by recording a commute, meal, or energy usage to unlock your insights.
        </p>
        
        <Link
          href="/app/log"
          className="inline-flex h-14 items-center justify-center gap-3 rounded-[var(--r-xl)] bg-[var(--accent)] px-8 text-base font-bold text-[var(--accent-fg)] shadow-[0_0_20px_var(--accent-line)] transition-all hover:scale-105 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_30px_var(--accent-line)]"
        >
          <PlusCircle className="size-5" />
          Log Your First Activity
        </Link>
      </div>
    );
  }

  const trend = dailyTotals(activities);
  const target = goal?.dailyTargetKg ?? BENCHMARKS.sustainableDailyTarget;
  const goalPct = target > 0 ? (analysis.dailyAverageKg / target) * 100 : 0;
  
  // Calculate Carbon Score
  const carbonScore = Math.max(0, Math.min(100, Math.round(100 - (analysis.dailyAverageKg / BENCHMARKS.globalDailyAvg) * 50)));

  const headlineInsights = analysis.insights
    .filter((i) => i.id !== "headline")
    .slice(0, 3);

  return (
    <div className="stagger pb-12">
      <PageHeader
        eyebrow="Dashboard"
        title="Your carbon overview."
        description="Monitor your environmental impact and track your progress."
      />

      {/* Engine Vitals HUD (Compact Stats Strip) */}
      <div className="mb-4 flex flex-wrap items-center gap-6 rounded-xl border border-[var(--border-strong)] bg-surface-2 px-6 py-3 shadow-[var(--shadow-sm)]">
        <div className="flex flex-1 items-center gap-3 border-r border-[var(--border-faint)] pr-6 min-w-max">
          <Activity className="size-4 text-[var(--accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Total Logged</span>
          <span className="ml-auto font-mono text-sm font-bold text-fg">{formatKg(analysis.totalKg)} <span className="text-xs text-fg-subtle">CO2e</span></span>
        </div>
        <div className="flex flex-1 items-center gap-3 border-r border-[var(--border-faint)] pr-6 min-w-max">
          <Gauge className="size-4 text-[var(--accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Daily Average</span>
          <span className="ml-auto font-mono text-sm font-bold text-fg">{formatKg(analysis.dailyAverageKg)} <span className="text-xs text-fg-subtle">/day</span></span>
        </div>
        <div className="flex flex-1 items-center gap-3 min-w-max">
          <Target className="size-4 text-[var(--accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Daily Target</span>
          <span className="ml-auto font-mono text-sm font-bold text-fg">{formatKg(target)} <span className="text-xs text-fg-subtle">kg/day</span></span>
        </div>
      </div>

      {/* Top Row: Massive Trend Chart & Core Status */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trend spans 2 columns */}
        <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 transition-all group-hover:scale-110 group-hover:opacity-20">
            <Activity className="size-32 text-[var(--accent)]" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-fg">Emission Trajectory</h2>
              <p className="text-sm text-fg-muted">Daily emissions over the past week.</p>
            </div>
            <div className="pb-2">
              <TrendChart data={trend} height={180} />
            </div>
          </div>
        </div>

        {/* System Tolerance (Replaces ProgressRing) */}
        <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col justify-between">
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Daily Goal Progress</span>
              <Target className="size-4 text-[var(--accent)]" />
            </div>
            
            <p className="text-sm font-bold text-fg-muted mb-2">Target Capacity</p>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-5xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fg to-fg-subtle">
                {Math.round(goalPct)}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--caution)]">Used</span>
            </div>

            {/* Custom Linear Tolerance Bar */}
            <div className="h-2.5 w-full rounded-full bg-surface-3 border border-[var(--border-strong)] overflow-hidden shadow-inner">
              <div 
                className="h-full bg-[var(--accent)] transition-all duration-1000 ease-out shadow-[0_0_10px_var(--accent)]" 
                style={{ width: `${Math.min(goalPct, 100)}%` }} 
              />
            </div>
            <p className="mt-3 text-xs text-fg-muted font-bold tracking-wide text-right">
              {formatKg(analysis.dailyAverageKg)} / {formatKg(target)} kg/day target
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Engine Status, Sector Allocation, Algorithmic Directives */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Engine Status / Carbon Score */}
        <div className="lg:col-span-1">
          <StatCard
            label="Carbon Score"
            value={String(carbonScore)}
            unit="/ 100"
            icon={Activity}
            hint={carbonScore >= 80 ? "Optimal Efficiency" : carbonScore >= 50 ? "Acceptable Parameters" : "Critical Burn Rate"}
          />
        </div>

        {/* Sector Allocation */}
        <div className="lg:col-span-1 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col">
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-fg">Sector Allocation</h2>
              <p className="text-sm text-fg-muted">Breakdown by footprint source.</p>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <BreakdownChart
                byCategory={analysis.byCategory}
                total={analysis.totalKg}
              />
            </div>
          </div>
        </div>

        {/* Algorithmic Directives (Insights) */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 pt-2">
            <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fg-muted">
              <Sparkles aria-hidden="true" className="size-4 text-[var(--accent)]" />
              Actionable Advice
            </h2>
            <Link
              href="/app/insights"
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] hover:underline"
            >
              Expand
            </Link>
          </div>
          {headlineInsights.length > 0 ? (
            <div className="flex-1">
              <InsightList insights={headlineInsights} dailyAverageKg={analysis.dailyAverageKg} compact />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-fg-muted rounded-3xl border border-[var(--border-faint)] bg-surface-2">
              Not enough data for advice.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Raw Telemetry Log */}
      <div className="mt-4 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-fg">Recent Activity</h2>
              <p className="text-sm text-fg-muted">Your latest logged footprints.</p>
            </div>
            <Link
              href="/app/log"
              className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-fg transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)] border border-[var(--border-strong)]"
            >
              View Full Log
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <div>
            <ActivityList limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
