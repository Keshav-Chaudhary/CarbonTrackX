"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { BENCHMARKS } from "@/lib/insights/analyze";
import {
  Button,
  Field,
  Input,
  useToast,
} from "@/components/ui";

/**
 * Lets the user set or clear a personal daily target (kg CO2e/day). The target
 * feeds the dashboard goal ring and gives the assistant a reference point.
 */
export function GoalSetter() {
  const goal = useCarbonStore((s) => s.goal);
  const setGoal = useCarbonStore((s) => s.setGoal);
  const { toast } = useToast();
  const [value, setValue] = useState(goal ? String(goal.dailyTargetKg) : "");

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (value.trim() === "") {
      setGoal(null);
      toast("Goal cleared.", "info");
      return;
    }
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) {
      toast("Enter a valid target.", "error");
      return;
    }
    setGoal(n);
    toast(`Daily target set to ${n} kg CO2e.`);
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] h-full flex flex-col">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-6 border-b border-[var(--border-faint)] pb-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
            <Target aria-hidden="true" className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-fg">Daily Target</h2>
            <p className="text-sm text-fg-muted">Set a maximum baseline to track against.</p>
          </div>
        </div>
        
        <form onSubmit={save} className="flex flex-col gap-6 flex-1 justify-center">
          <Field
            label="Target (kg CO2e per day)"
            hint={`Recommended optimal baseline ≈ ${BENCHMARKS.sustainableDailyTarget} kg/day`}
          >
            {(ids) => (
              <Input
                {...ids}
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={String(BENCHMARKS.sustainableDailyTarget)}
                className="tnum h-12 text-lg rounded-xl border-[var(--border-strong)] focus:border-[var(--accent-line)] focus:ring-[var(--accent)] bg-surface-1 shadow-inner"
              />
            )}
          </Field>
          
          <div className="flex gap-3 mt-2">
            <Button type="submit" className="h-12 flex-1 rounded-xl font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:scale-[1.02] transition-transform shadow-[0_0_15px_var(--accent-subtle)]">
              Save Target
            </Button>
            {goal && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 rounded-xl border border-[var(--border-strong)] hover:bg-[var(--critical-subtle)] hover:text-[var(--critical)] hover:border-[var(--critical)] transition-colors"
                onClick={() => {
                  setValue("");
                  setGoal(null);
                  toast("Goal cleared.", "info");
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
