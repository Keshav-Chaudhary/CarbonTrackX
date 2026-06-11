import { ActivityForm } from "@/components/app/activity/ActivityForm";
import { QuickPresets } from "@/components/app/activity/QuickPresets";
import { Leaf } from "lucide-react";
import { PRESETS } from "./log-constants";

interface LogActionsProps {
  setPendingPreset: (preset: typeof PRESETS[number] | null) => void;
}

export function LogActions({ setPendingPreset }: LogActionsProps) {
  return (
    <div className="flex flex-col gap-6 lg:col-span-5">
      <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[var(--accent-subtle)] blur-[50px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-faint)] pb-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
              <Leaf className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-fg">Track an action</h2>
              <p className="text-sm text-fg-muted">Enter your latest activity to calculate its footprint.</p>
            </div>
          </div>
          <ActivityForm />
        </div>
      </div>
      <QuickPresets onSelectPreset={setPendingPreset} />
    </div>
  );
}
