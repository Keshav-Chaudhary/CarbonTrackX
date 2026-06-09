"use client";

import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import { ECO_TIPS } from "./log-constants";

export function EcoTipCard() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [fadeTip, setFadeTip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeTip(true);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % ECO_TIPS.length);
        setFadeTip(false);
      }, 500); // Wait for fade out
    }, 8000); // Change every 8s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--accent-subtle)] blur-[40px] pointer-events-none transition-all group-hover:scale-150" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="size-5 text-[var(--accent)] animate-pulse" />
          <h2 className="text-lg font-bold text-fg">Did you know?</h2>
        </div>
        <div className="h-[120px] relative mt-2">
          <p 
            className={`absolute inset-x-0 top-0 text-sm text-fg-muted italic leading-relaxed transition-all duration-500 ease-in-out ${
              fadeTip ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            &quot;{ECO_TIPS[currentTipIndex]}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
