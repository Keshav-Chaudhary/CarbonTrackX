"use client";

import { useCarbonStore } from "@/lib/store/carbon-store";
import { useFootprint } from "@/components/app/shared/useFootprint";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { GoalSetter } from "./GoalSetter";
import { DashboardSkeleton } from "@/components/app/shared/Skeletons";
import { ProgressRing, formatKg } from "@/components/ui";
import { Trophy, TrendingDown } from "lucide-react";
import { BENCHMARKS } from "@/lib/insights/analyze";
import { dailyTotals } from "@/lib/emissions/calculate";

export function GoalsClient() {
  const { hydrated, analysis, activityCount } = useFootprint();
  const activities = useCarbonStore((s) => s.activities);
  const goal = useCarbonStore((s) => s.goal);

  if (!hydrated) return <DashboardSkeleton />;

  const target = goal?.dailyTargetKg ?? BENCHMARKS.sustainableDailyTarget;
  const goalPct = target > 0 ? (analysis.dailyAverageKg / target) * 100 : 0;
  
  // Calculate consecutive days below target (Milestone)
  const trend = dailyTotals(activities);
  let streak = 0;
  for (let i = trend.length - 1; i >= 0; i--) {
    if (trend[i].kg <= target) {
      streak++;
    } else {
      break;
    }
  }

  // Projected completion / savings
  const yearlyCurrent = analysis.dailyAverageKg * 365;
  const yearlyTarget = target * 365;
  const projectedSavings = Math.max(0, yearlyCurrent - yearlyTarget);
  const isMeetingGoal = analysis.dailyAverageKg <= target;

  return (
    <div className="stagger pb-12">
      <PageHeader
        eyebrow="Green Targets"
        title="Your Climate Milestones"
        description="Set aggressive emission goals and track your real-time progress towards a sustainable footprint."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GoalSetter />

        {activityCount > 0 && (
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-fg">Target Progress</h2>
                <p className="mt-1 text-sm text-fg-muted">Your current daily average against your configured target.</p>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <ProgressRing
                  value={goalPct}
                  tone={goalPct <= 100 ? "accent" : "critical"}
                  label={`${Math.round(goalPct)}%`}
                  sublabel="of target"
                  ariaLabel={`Daily average is ${Math.round(goalPct)}% of your target`}
                  size={140}
                />
                <p className="text-center text-sm font-semibold text-fg mt-4">
                  {formatKg(analysis.dailyAverageKg)} <span className="font-normal text-fg-subtle">vs {formatKg(target)} target</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {activityCount > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Milestones Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-row items-center gap-6">
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
            <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
              <Trophy aria-hidden="true" className="size-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
            </span>
            <div className="relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-fg-muted mb-1">Target Streak</h2>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-fg">{streak} <span className="text-base font-medium text-fg-subtle">{streak === 1 ? "day" : "days"}</span></span>
                <span className="text-xs font-semibold text-fg-subtle mt-1">consecutive days meeting target.</span>
              </div>
            </div>
          </div>

          {/* Projected Completion Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-row items-center gap-6">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
            <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--positive)]">
              <TrendingDown aria-hidden="true" className="size-6 text-[var(--positive)] group-hover:scale-110 transition-transform" />
            </span>
            <div className="relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-fg-muted mb-1">Annual Forecast</h2>
              {isMeetingGoal ? (
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-[var(--positive)]">On Track</span>
                  <span className="text-xs font-semibold text-fg-subtle mt-1">
                    Pacing to meet {formatKg(yearlyTarget)} kg CO2e limit.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-[var(--critical)] tracking-tight">Overshooting</span>
                  <span className="text-xs font-semibold text-fg-subtle mt-1">
                    Pacing to exceed by {formatKg(projectedSavings)} kg CO2e.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
