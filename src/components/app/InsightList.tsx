import { Lightbulb, TrendingDown, Trophy, type LucideIcon } from "lucide-react";
import type { Insight, InsightLevel } from "@/lib/insights/analyze";
import { Badge } from "@/components/ui";
import { formatKg } from "@/components/ui";
import { CATEGORY_ICON } from "@/components/charts/icons";

const LEVEL_META: Record<
  InsightLevel,
  { label: string; tone: "positive" | "caution" | "info"; icon: LucideIcon }
> = {
  win: { label: "Achievement", tone: "positive", icon: Trophy },
  opportunity: { label: "High Leverage", tone: "caution", icon: TrendingDown },
  info: { label: "Observation", tone: "info", icon: Lightbulb },
};

import { useToast } from "@/components/ui/Toast";
import { useCarbonStore } from "@/lib/store/carbon-store";

/**
 * Renders the deterministic engine's recommendations as a list of cards. Each
 * card shows a clearly labelled level badge (meaning is not colour-only), the
 * advice text, and the quantified potential saving where one was computed.
 */
export function InsightList({ insights, dailyAverageKg }: { insights: Insight[], dailyAverageKg?: number }) {
  const { toast } = useToast();
  const currentGoal = useCarbonStore((s) => s.goal);
  const setGoal = useCarbonStore((s) => s.setGoal);

  if (insights.length === 0) return null;

  const handleCommit = (insight: Insight) => {
    if (!insight.potentialSavingKg) return;
    
    // Estimate daily reduction (assuming potential saving spans ~a week/month based on logs)
    const dailyReduction = insight.potentialSavingKg / 7;
    const baseTarget = currentGoal?.dailyTargetKg ?? (dailyAverageKg || 10.96);
    const newTarget = Math.max(0, baseTarget - dailyReduction);
    
    setGoal(newTarget);
    toast(`Awesome! Your daily target is now lowered to ${formatKg(newTarget)} CO2e.`);
  };

  return (
    <ul className="stagger flex flex-col gap-3" aria-label="Personalized insights">
      {insights.map((insight) => {
        const meta = LEVEL_META[insight.level];
        const CatIcon = insight.category
          ? CATEGORY_ICON[insight.category]
          : meta.icon;
        return (
          <li
            key={insight.id}
            className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-6 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="relative mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] group-hover:text-[var(--accent)] transition-colors"
              >
                <CatIcon className="size-5 text-fg-muted group-hover:text-[var(--accent)]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-fg">{insight.title}</h3>
                    {insight.confidence && (
                      <span className="text-[10px] font-medium tracking-wider text-fg-muted uppercase">
                        {insight.confidence} Confidence
                      </span>
                    )}
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-fg-muted">{insight.detail}</p>
                {insight.reasoning && (
                  <div className="relative mt-3 rounded-xl bg-surface-1 p-3 border border-[var(--border-strong)] shadow-inner">
                    <p className="text-sm text-fg-subtle">
                      <span className="font-bold text-fg mr-2">Analysis:</span>
                      {insight.reasoning}
                    </p>
                  </div>
                )}
                {typeof insight.potentialSavingKg === "number" &&
                  insight.potentialSavingKg > 0 && (
                    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-surface-1 p-4 border border-[var(--border-strong)]">
                      <div className="flex items-center justify-between">
                        <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--positive)]">
                          <TrendingDown aria-hidden="true" className="size-4" />
                          Save up to {formatKg(insight.potentialSavingKg)} CO2e
                        </p>
                        {dailyAverageKg && dailyAverageKg > 0 ? (
                          <span className="text-xs font-semibold text-fg-muted">
                            {Math.min(100, Math.round((insight.potentialSavingKg / dailyAverageKg) * 100))}% of daily impact
                          </span>
                        ) : null}
                      </div>
                      
                      {dailyAverageKg && dailyAverageKg > 0 ? (
                        <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--positive)] rounded-full transition-all duration-1000 shadow-[0_0_10px_var(--positive)]" 
                            style={{ width: `${Math.min(100, Math.round((insight.potentialSavingKg / dailyAverageKg) * 100))}%` }} 
                          />
                        </div>
                      ) : null}

                      <div className="mt-2 flex justify-end">
                        <button 
                          onClick={() => handleCommit(insight)}
                          className="text-xs font-bold bg-[var(--accent)] text-[var(--accent-fg)] px-4 py-2 rounded-lg hover:bg-[var(--accent-strong)] hover:scale-105 transition-all shadow-[0_0_10px_var(--accent-line)]"
                        >
                          Commit to Change
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
