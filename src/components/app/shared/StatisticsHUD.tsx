"use client";

import { formatKg } from "@/components/ui";

interface StatisticsHUDProps {
  filteredCount: number;
  totalEmissions: number;
  maxImpact: number;
  avgImpact: number;
}

export function StatisticsHUD({
  filteredCount,
  totalEmissions,
  maxImpact,
  avgImpact,
}: StatisticsHUDProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-surface-2 border-b border-[var(--border-faint)] text-xs text-fg-subtle">
      <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Filtered Count</span>
        <span className="block text-lg font-semibold text-fg mt-0.5 tnum">{filteredCount}</span>
      </div>
      <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Emissions Sum</span>
        <span className="block text-lg font-semibold text-[var(--accent)] mt-0.5 tnum">{formatKg(totalEmissions)}</span>
      </div>
      <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Peak Activity</span>
        <span className="block text-lg font-semibold text-fg mt-0.5 tnum">{formatKg(maxImpact)}</span>
      </div>
      <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Average Impact</span>
        <span className="block text-lg font-semibold text-fg mt-0.5 tnum">{formatKg(avgImpact)}</span>
      </div>
    </div>
  );
}
