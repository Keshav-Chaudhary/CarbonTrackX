import Link from "next/link";
import {
  ArrowRight,
  Car,
  Zap,
  ShoppingBag,
  Activity,
  Target,
  Sparkles,
  Cpu,
  Database,
  Lock,
} from "lucide-react";
import { EMISSION_FACTORS } from "@/lib/emissions/factors";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const CATEGORIES = [
  { icon: Car, label: "Transport", color: "var(--color-transport)" },
  { icon: Zap, label: "Energy", color: "var(--color-energy)" },
  { icon: Activity, label: "Custom", color: "var(--color-custom)" },
  { icon: ShoppingBag, label: "Shopping", color: "var(--color-shopping)" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
        {/* Subtle Background Glow */}
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            
            {/* Left Column: Copy */}
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

            {/* Right Column: Visual Mockup */}
            <div className="relative hidden lg:block custom-fade-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg)] via-transparent to-transparent z-10 pointer-events-none rounded-xl" />
              <div className="relative z-0 grid gap-4 grid-cols-2">
                
                {/* Mock Card 1: Score */}
                <div className="group relative col-span-2 overflow-hidden rounded-2xl border border-[var(--border-faint)] bg-surface-2 p-6 shadow-[var(--shadow-md)] custom-rise transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-lg)]" style={{ animationDelay: '0.1s' }}>
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
                    <span className="flex size-2 rounded-full bg-[var(--positive)] shadow-[0_0_8px_var(--positive)]"></span>
                    <p className="text-xs text-[var(--positive)] font-bold tracking-widest uppercase">Excellent Pace</p>
                  </div>
                </div>
                
                {/* Mock Card 2: AI */}
                <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-faint)] bg-surface-2 p-5 shadow-[var(--shadow-sm)] custom-rise transition-all hover:border-[var(--accent-line)]" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2 border-b border-[var(--border-faint)] pb-3 mb-3">
                    <Sparkles className="size-4 text-[var(--accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">AI Coach</span>
                  </div>
                  <p className="text-sm font-medium text-fg leading-relaxed">
                    "Your daily average is dropping. Great job substituting <span className="text-[var(--accent)]">red meat</span>!"
                  </p>
                </div>

                {/* Mock Card 3: Categories */}
                <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-faint)] bg-surface-2 p-5 shadow-[var(--shadow-sm)] custom-rise transition-all hover:border-[var(--accent-line)]" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-fg-muted border-b border-[var(--border-faint)] pb-3 mb-4">Breakdown</h3>
                  <div className="flex flex-col gap-3.5">
                    {CATEGORIES.slice(0, 3).map((cat, i) => (
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

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Engine Pulse (Staggered Stats) */}
      <section className="bg-surface-2 border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-12 md:px-12">
          <ScrollReveal delayMs={100}><StatPulse value="100%" label="Deterministic Output" /></ScrollReveal>
          <div className="hidden h-12 w-px bg-[var(--border)] md:block" />
          <ScrollReveal delayMs={200}><StatPulse value="0ms" label="Calculation Latency" /></ScrollReveal>
          <div className="hidden h-12 w-px bg-[var(--border)] md:block" />
          <ScrollReveal delayMs={300}><StatPulse value="24/7" label="Local Telemetry" /></ScrollReveal>
        </div>
      </section>

      {/* Features: Bento Box Layout */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        <ScrollReveal animation="custom-fade-in" className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-fg sm:text-5xl">
            A masterclass in telemetry.
          </h2>
          <p className="mt-6 text-xl text-fg-muted leading-relaxed">
            CTx abandons spreadsheets for an algorithmic, dynamic dashboard. Every interaction is calculated, strictly private, and beautifully rendered.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Main Feature: Gemini AI (Spans 2 columns) */}
          <ScrollReveal delayMs={100} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] md:col-span-2 transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-subtle)] blur-[80px] transition-all group-hover:scale-150" />
            <span className="relative flex size-14 items-center justify-center rounded-2xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] mb-8">
              <Sparkles className="size-7" />
            </span>
            <h3 className="relative text-2xl font-bold text-fg">Algorithmic Narrator</h3>
            <p className="relative mt-4 max-w-lg text-lg text-fg-muted leading-relaxed">
              Google Gemini powers the coaching experience, strictly constrained to narrate your deterministic local data. Zero hallucinations. Total accuracy.
            </p>
          </ScrollReveal>

          {/* Sub Feature 1 */}
          <ScrollReveal delayMs={200} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
              <Cpu className="size-6" />
            </span>
            <h3 className="text-xl font-bold text-fg">Hyper-Local Telemetry</h3>
            <p className="mt-3 text-fg-muted leading-relaxed">
              Log activities in real-time. The engine calculates impact instantly without pinging a server.
            </p>
          </ScrollReveal>

          {/* Sub Feature 2 */}
          <ScrollReveal delayMs={300} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
              <Target className="size-6" />
            </span>
            <h3 className="text-xl font-bold text-fg">Dynamic Milestones</h3>
            <p className="mt-3 text-fg-muted leading-relaxed">
              Set aggressive carbon ceilings. The engine paces your streaks and projects annual burn rates.
            </p>
          </ScrollReveal>

          {/* Sub Feature 3 (Spans 2 columns on desktop) */}
          <ScrollReveal delayMs={400} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] md:col-span-2 transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex-1">
              <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
                <Lock className="size-6" />
              </span>
              <h3 className="text-xl font-bold text-fg">Progressive Sync</h3>
              <p className="mt-3 text-fg-muted leading-relaxed">
                Launch without an account. Your footprint persists in local storage, syncing anonymously to Firebase in the background.
              </p>
            </div>
            <div className="hidden sm:flex size-32 shrink-0 items-center justify-center rounded-full bg-surface-3 border border-[var(--border)] shadow-inner">
              <Database className="size-12 text-fg-muted opacity-50" />
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* The Event Horizon (Final CTA) */}
      <section className="relative overflow-hidden border-t border-[var(--border)] bg-surface">
        <div className="absolute inset-0 bg-surface-2 -z-20" />
        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_var(--accent-subtle)_0%,_transparent_70%)] opacity-40 mix-blend-screen" />
        
        <ScrollReveal className="mx-auto max-w-5xl px-4 py-32 text-center sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black tracking-tight text-fg sm:text-7xl uppercase drop-shadow-sm">
            Stop guessing.<br/>
            <span className="text-[var(--accent)]">Start measuring.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-fg-muted font-medium">
            Join CarbonTrackX today. No onboarding flows. No mandatory sign-ups. Just pure, deterministic telemetry.
          </p>
          <div className="mt-14 flex justify-center">
            <Link
              href="/app"
              className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--accent)] px-12 text-lg font-bold text-[var(--accent-fg)] shadow-[0_0_30px_var(--accent-line)] transition-all hover:scale-105 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-line)]"
            >
              Initialize Dashboard
              <ArrowRight aria-hidden="true" className="size-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

function StatPulse({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <p className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-fg to-fg-subtle drop-shadow-sm">{value}</p>
      <p className="mt-3 text-xs font-bold text-[var(--accent)] uppercase tracking-widest">{label}</p>
    </div>
  );
}
