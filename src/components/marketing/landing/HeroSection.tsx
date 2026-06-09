import Link from "next/link";
import { Activity, ArrowRight, Car, Zap, ShoppingBag, Target } from "lucide-react";

const CATEGORIES = [
  { icon: Car, label: "Transport", color: "var(--color-transport)" },
  { icon: Zap, label: "Energy", color: "var(--color-energy)" },
  { icon: Activity, label: "Custom", color: "var(--color-custom)" },
  { icon: ShoppingBag, label: "Shopping", color: "var(--color-shopping)" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

          <div className="max-w-2xl stagger">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_0_15px_var(--accent-line)]">
                <Activity aria-hidden="true" className="size-4" />
              </span>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm">
                Next-Gen Architecture
              </span>
            </div>
            <h1 className="mt-6 text-balance text-5xl font-black tracking-tight text-fg lg:text-7xl">
              Master your <span className="text-[var(--accent)]">climate impact.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-fg-muted lg:text-xl leading-relaxed">
              CarbonTrackX is your premium personal climate companion. Track emissions with precision, hit dynamic targets, and let our AI co-pilot guide you to a sustainable lifestyle.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-8 text-base font-bold text-[var(--accent-fg)] shadow-[var(--shadow-md)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:bg-[var(--accent-strong)]"
              >
                Launch CTx
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
              <Link
                href="/theengine"
                className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-2 px-8 text-base font-semibold text-fg transition-colors hover:bg-surface-3"
              >
                View The Engine
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block custom-fade-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg)] via-transparent to-transparent z-10 pointer-events-none rounded-xl" />
            <div className="relative z-0 grid gap-4 grid-cols-2">
              <HeroScoreCard />
              <HeroAICard />
              <HeroBreakdownCard categories={CATEGORIES} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroScoreCard() {
  return (
    <div className="group relative col-span-2 overflow-hidden rounded-2xl border border-[var(--border-faint)] bg-surface-2 p-6 shadow-[var(--shadow-md)] custom-rise transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-lg)]" style={{ animationDelay: "0.1s" }}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] transition-transform group-hover:scale-150" />
      <div className="relative flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-widest text-fg-muted uppercase">Carbon Score</h3>
        <span className="flex size-8 items-center justify-center rounded-full bg-surface-3 border border-[var(--border)] text-[var(--accent)] shadow-sm">
          <Target className="size-4" />
        </span>
      </div>
      <div className="relative mt-2 flex items-baseline gap-1">
        <span className="text-6xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fg to-fg-subtle drop-shadow-sm">92</span>
        <span className="text-xl font-bold text-fg-muted">/100</span>
      </div>
      <div className="relative mt-3 flex items-center gap-2">
        <span className="flex size-2 rounded-full bg-[var(--positive)] shadow-[0_0_8px_var(--positive)]" />
        <p className="text-xs text-[var(--positive)] font-bold tracking-widest uppercase">Excellent Pace</p>
      </div>
    </div>
  );
}

function HeroAICard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-faint)] bg-surface-2 p-5 shadow-[var(--shadow-sm)] custom-rise transition-all hover:border-[var(--accent-line)]" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 border-b border-[var(--border-faint)] pb-3 mb-3">
        <Activity className="size-4 text-[var(--accent)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">AI Coach</span>
      </div>
      <p className="text-sm font-medium text-fg leading-relaxed">
        &quot;Your daily average is dropping. Great job substituting <span className="text-[var(--accent)]">red meat</span>!&quot;
      </p>
    </div>
  );
}

function HeroBreakdownCard({ categories }: { categories: typeof CATEGORIES }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-faint)] bg-surface-2 p-5 shadow-[var(--shadow-sm)] custom-rise transition-all hover:border-[var(--accent-line)]" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-fg-muted border-b border-[var(--border-faint)] pb-3 mb-4">Breakdown</h3>
      <div className="flex flex-col gap-3.5">
        {categories.slice(0, 3).map((cat, i) => (
          <div key={cat.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-fg">{cat.label}</span>
              <span className="text-[10px] font-bold tabular-nums text-fg-muted">{[45, 30, 15][i]}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3 border border-[var(--border-faint)]">
              <div className="h-full rounded-full transition-all" style={{ width: `${[45, 30, 15][i]}%`, backgroundColor: cat.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
