"use client";

import { StatisticsHUD } from "@/components/app/shared/StatisticsHUD";

interface LogStatisticsProps {
  filteredCount: number;
  totalEmissions: number;
  maxImpact: number;
  avgImpact: number;
}

export function LogStatistics({
  filteredCount,
  totalEmissions,
  maxImpact,
  avgImpact,
}: LogStatisticsProps) {
  return (
    <StatisticsHUD
      filteredCount={filteredCount}
      totalEmissions={totalEmissions}
      maxImpact={maxImpact}
      avgImpact={avgImpact}
    />
  );
}
