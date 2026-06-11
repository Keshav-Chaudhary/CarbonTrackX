"use client";

import Link from "next/link";
import { Lightbulb, Globe, Target, TrendingDown } from "lucide-react";
import { BENCHMARKS } from "@/lib/insights/analyze";
import { useFootprint } from "@/components/app/shared/useFootprint";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { InsightList } from "./InsightList";
import {
  formatKg,
} from "@/components/ui";
import { PageSkeleton } from "@/components/app/shared/Skeletons";


export function InsightsClient() {
  const { hydrated, analysis, activityCount } = useFootprint();

  if (!hydrated) return <PageSkeleton />;

  if (activityCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 custom-fade-in">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[var(--accent-subtle)] blur-[60px] rounded-full scale-150 animate-pulse-hover pointer-events-none" />
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[var(--r-xl)] border border-[var(--border-strong)] bg-surface-2 shadow-xl">
            <Lightbulb className="size-10 text-[var(--accent)]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-fg mb-4">
          Awaiting your first logs...
        </h1>
        <p className="max-w-md text-lg text-fg-subtle mb-10 leading-relaxed">
          We need a little bit of data to generate personalized recommendations. Once you log a few activities, we&apos;ll surface the highest-impact ways to cut your emissions.
        </p>
        
        <Link
          href="/app/log"
          className="inline-flex h-14 items-center justify-center gap-3 rounded-[var(--r-xl)] bg-[var(--accent)] px-8 text-base font-bold text-[var(--accent-fg)] shadow-[0_0_20px_var(--accent-line)] transition-all hover:scale-105 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_30px_var(--accent-line)]"
        >
          <Lightbulb className="size-5" />
          Log an Activity
        </Link>
      </div>
    );
  }

  const { comparison, dailyAverageKg } = analysis;

  return (
    <div className="stagger pb-12">
      <PageHeader
        eyebrow="Insights"
        title="Your Climate Intelligence"
        description="Our deterministic engine processes your activity logs to give you actionable, mathematically sound advice on reducing your footprint."
      />

      <div className="mb-10 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-fg">Your Baseline</h2>
          <p className="mt-1 text-sm text-fg-muted">
            See how your daily footprint compares to global metrics and your historical logs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Daily Impact */}
          <div className="rounded-2xl bg-surface-1 p-5 border border-[var(--border-strong)] shadow-inner flex flex-col justify-between">
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="size-3.5 text-[var(--accent)]" /> Daily Impact
            </p>
            <div>
              <p className="text-3xl font-black text-fg">{formatKg(dailyAverageKg)} <span className="text-sm font-normal text-fg-subtle">CO2e</span></p>
              <p className={`mt-2 text-xs font-medium ${comparison.vsGlobalPct <= 0 ? 'text-[var(--positive)]' : 'text-[var(--critical)]'}`}>
                {comparison.vsGlobalPct <= 0
                  ? `${Math.abs(comparison.vsGlobalPct)}% under global baseline`
                  : `${comparison.vsGlobalPct}% over global baseline`}
              </p>
            </div>
          </div>

          {/* Card 2: Total Logged */}
          <div className="rounded-2xl bg-surface-1 p-5 border border-[var(--border-strong)] shadow-inner flex flex-col justify-between">
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target className="size-3.5 text-[var(--accent)]" /> Total Logged
            </p>
            <div>
              <p className="text-3xl font-black text-fg">{formatKg(analysis.totalKg)} <span className="text-sm font-normal text-fg-subtle">CO2e</span></p>
              <p className="mt-2 text-xs font-medium text-fg-subtle">
                Across {activityCount} {activityCount === 1 ? 'activity' : 'activities'}
              </p>
            </div>
          </div>

          {/* Card 3: Top Category */}
          <div className="rounded-2xl bg-surface-1 p-5 border border-[var(--border-strong)] shadow-inner flex flex-col justify-between">
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingDown className="size-3.5 text-[var(--accent)]" /> Primary Source
            </p>
            <div>
              {analysis.topCategory ? (
                <>
                  <p className="text-3xl font-black text-fg capitalize">{analysis.topCategory.category}</p>
                  <p className="mt-2 text-xs font-medium text-[var(--caution)]">
                    {analysis.topCategory.share}% of total footprint
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-black text-fg">-</p>
                  <p className="mt-2 text-xs font-medium text-fg-subtle">Not enough data</p>
                </>
              )}
            </div>
          </div>

          {/* Card 4: Target Status */}
          <div className="rounded-2xl bg-surface-1 p-5 border border-[var(--border-strong)] shadow-inner flex flex-col justify-between">
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lightbulb className="size-3.5 text-[var(--accent)]" /> Green Target
            </p>
            <div>
              <p className="text-3xl font-black text-fg">{BENCHMARKS.sustainableDailyTarget} <span className="text-sm font-normal text-fg-subtle">kg/day</span></p>
              <p className={`mt-2 text-xs font-medium ${comparison.vsTarget === "under" ? "text-[var(--positive)]" : "text-[var(--caution)]"}`}>
                {comparison.vsTarget === "under" ? "Meeting your goals" : "Needs improvement"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-8 flex items-center gap-2 text-xl font-bold text-fg">
        <TrendingDown aria-hidden="true" className="size-5 text-[var(--accent)]" />
        Actionable Advice
      </h2>
      <InsightList insights={analysis.insights} dailyAverageKg={dailyAverageKg} />
    </div>
  );
}
