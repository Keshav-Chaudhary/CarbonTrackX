"use client";

import { useCarbonStore } from "@/lib/store/carbon-store";
import { dailyTotals } from "@/lib/emissions/calculate";
import { BENCHMARKS } from "@/lib/insights/analyze";
import { useFootprint } from "@/components/app/shared/useFootprint";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { DashboardSkeleton } from "@/components/app/shared/Skeletons";
import { DashboardEmptyState } from "./dashboard/DashboardEmptyState";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { DashboardCharts } from "./dashboard/DashboardCharts";
import { DashboardInsights } from "./dashboard/DashboardInsights";

export function DashboardClient() {
  const { hydrated, analysis, activityCount } = useFootprint();
  const activities = useCarbonStore((s) => s.activities);
  const goal = useCarbonStore((s) => s.goal);

  if (!hydrated) return <DashboardSkeleton />;
  if (activityCount === 0) return <DashboardEmptyState />;

  const trend = dailyTotals(activities);
  const target = goal?.dailyTargetKg ?? BENCHMARKS.sustainableDailyTarget;
  const goalPct = target > 0 ? (analysis.dailyAverageKg / target) * 100 : 0;
  const carbonScore = Math.max(0, Math.min(100, Math.round(100 - (analysis.dailyAverageKg / BENCHMARKS.globalDailyAvg) * 50)));
  const headlineInsights = analysis.insights.filter((i) => i.id !== "headline").slice(0, 3);

  return (
    <div className="stagger pb-12">
      <PageHeader
        eyebrow="Dashboard"
        title="Your carbon overview."
        description="Monitor your environmental impact and track your progress."
      />
      <DashboardOverview analysis={analysis} target={target} />
      <DashboardCharts
        analysis={analysis}
        trend={trend}
        target={target}
        goalPct={goalPct}
        carbonScore={carbonScore}
        headlineInsights={headlineInsights}
      />
      <DashboardInsights />
    </div>
  );
}
