import Link from "next/link";
import { Activity, Target, Sparkles } from "lucide-react";
import { TrendChart, type TrendPoint } from "@/components/charts/TrendChart";
import { BreakdownChart } from "@/components/charts/BreakdownChart";
import { InsightList } from "@/components/app/insights/InsightList";
import { StatCard } from "@/components/app/shared/StatCard";
import { formatKg } from "@/components/ui";
import type { FootprintAnalysis, Insight } from "@/lib/insights/analyze";

interface DashboardChartsProps {
  analysis: FootprintAnalysis;
  trend: TrendPoint[];
  target: number;
  goalPct: number;
  carbonScore: number;
  headlineInsights: Insight[];
}

export function DashboardCharts({
  analysis,
  trend,
  target,
  goalPct,
  carbonScore,
  headlineInsights,
}: DashboardChartsProps) {
  return (
    <>
      {/* Top Row: Trend Chart & Goal Progress */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
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

        <GoalProgressCard analysis={analysis} target={target} goalPct={goalPct} />
      </div>

      {/* Middle Row: Score, Breakdown, Insights */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StatCard
            label="Carbon Score"
            value={String(carbonScore)}
            unit="/ 100"
            icon={Activity}
            hint={carbonScore >= 80 ? "Optimal Efficiency" : carbonScore >= 50 ? "Acceptable Parameters" : "Critical Burn Rate"}
          />
        </div>

        <div className="lg:col-span-1 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col">
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-fg">Sector Allocation</h2>
              <p className="text-sm text-fg-muted">Breakdown by footprint source.</p>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <BreakdownChart byCategory={analysis.byCategory} total={analysis.totalKg} />
            </div>
          </div>
        </div>

        <DashboardInsightsPanel headlineInsights={headlineInsights} dailyAverageKg={analysis.dailyAverageKg} />
      </div>
    </>
  );
}

function GoalProgressCard({ analysis, target, goalPct }: { analysis: FootprintAnalysis; target: number; goalPct: number }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col justify-between">
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
  );
}

function DashboardInsightsPanel({ headlineInsights, dailyAverageKg }: { headlineInsights: Insight[]; dailyAverageKg: number }) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-3">
      <div className="flex items-center justify-between px-2 pt-2">
        <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fg-muted">
          <Sparkles aria-hidden="true" className="size-4 text-[var(--accent)]" />
          Actionable Advice
        </h2>
        <Link href="/app/insights" className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] hover:underline">
          Expand
        </Link>
      </div>
      {headlineInsights.length > 0 ? (
        <div className="flex-1">
          <InsightList insights={headlineInsights} dailyAverageKg={dailyAverageKg} compact />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-fg-muted rounded-3xl border border-[var(--border-faint)] bg-surface-2">
          Not enough data for advice.
        </div>
      )}
    </div>
  );
}
