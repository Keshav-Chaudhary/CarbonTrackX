import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityList } from "@/components/app/activity/ActivityList";

export function DashboardInsights() {
  return (
    <div className="mt-4 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-fg">Recent Activity</h2>
            <p className="text-sm text-fg-muted">Your latest logged footprints.</p>
          </div>
          <Link
            href="/app/log"
            className="inline-flex items-center gap-2 rounded-lg bg-surface-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-fg transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)] border border-[var(--border-strong)]"
          >
            View Full Log
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
        <div>
          <ActivityList limit={5} />
        </div>
      </div>
    </div>
  );
}
