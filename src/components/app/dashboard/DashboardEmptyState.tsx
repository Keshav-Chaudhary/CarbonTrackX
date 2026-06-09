import Link from "next/link";
import { PlusCircle, Leaf } from "lucide-react";

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 custom-fade-in">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-[var(--accent-subtle)] blur-[60px] rounded-full scale-150 animate-pulse-hover pointer-events-none" />
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[var(--r-xl)] border border-[var(--border-strong)] bg-surface-2 shadow-xl">
          <Leaf className="size-10 text-[var(--accent)]" />
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight text-fg mb-4">
        Ready to track your footprint?
      </h1>
      <p className="max-w-md text-lg text-fg-muted mb-10 leading-relaxed">
        You haven&apos;t logged any activities yet. Start by recording a commute, meal, or energy usage to unlock your insights.
      </p>

      <Link
        href="/app/log"
        className="inline-flex h-14 items-center justify-center gap-3 rounded-[var(--r-xl)] bg-[var(--accent)] px-8 text-base font-bold text-[var(--accent-fg)] shadow-[0_0_20px_var(--accent-line)] transition-all hover:scale-105 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_30px_var(--accent-line)]"
      >
        <PlusCircle className="size-5" />
        Log Your First Activity
      </Link>
    </div>
  );
}
