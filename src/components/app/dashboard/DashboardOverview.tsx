import { Activity, Gauge, Target } from "lucide-react";
import { formatKg } from "@/components/ui";
import type { FootprintAnalysis } from "@/lib/insights/analyze";

interface DashboardOverviewProps {
  analysis: FootprintAnalysis;
  target: number;
}

export function DashboardOverview({ analysis, target }: DashboardOverviewProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-6 rounded-xl border border-[var(--border-strong)] bg-surface-2 px-6 py-3 shadow-[var(--shadow-sm)]">
      <div className="flex flex-1 items-center gap-3 border-r border-[var(--border-faint)] pr-6 min-w-max">
        <Activity className="size-4 text-[var(--accent)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Total Logged</span>
        <span className="ml-auto font-mono text-sm font-bold text-fg">
          {formatKg(analysis.totalKg)} <span className="text-xs text-fg-subtle">CO2e</span>
        </span>
      </div>
      <div className="flex flex-1 items-center gap-3 border-r border-[var(--border-faint)] pr-6 min-w-max">
        <Gauge className="size-4 text-[var(--accent)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Daily Average</span>
        <span className="ml-auto font-mono text-sm font-bold text-fg">
          {formatKg(analysis.dailyAverageKg)} <span className="text-xs text-fg-subtle">/day</span>
        </span>
      </div>
      <div className="flex flex-1 items-center gap-3 min-w-max">
        <Target className="size-4 text-[var(--accent)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">Daily Target</span>
        <span className="ml-auto font-mono text-sm font-bold text-fg">
          {formatKg(target)} <span className="text-xs text-fg-subtle">kg/day</span>
        </span>
      </div>
    </div>
  );
}
