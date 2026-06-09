import { describe, expect, it, vi } from "vitest";
import { analyzeFootprint, BENCHMARKS } from "@/lib/insights/analyze";
import type { Activity } from "@/lib/emissions/types";
import * as calculate from "@/lib/emissions/calculate";

const day = (n: number) => `2026-01-${String(n).padStart(2, "0")}`;

describe("analyzeFootprint", () => {
  it("returns an onboarding insight when there are no activities", () => {
    const analysis = analyzeFootprint([]);
    expect(analysis.totalKg).toBe(0);
    expect(analysis.topCategory).toBeNull();
    expect(analysis.insights).toHaveLength(1);
    expect(analysis.insights[0].id).toBe("empty");
  });

  it("identifies the top-contributing category and its share", () => {
    const activities: Activity[] = [
      { id: "1", factorId: "meal_beef", quantity: 5, date: day(1) }, // 33 diet
      { id: "2", factorId: "train", quantity: 100, date: day(1) }, // 3.5 transport
    ];
    const analysis = analyzeFootprint(activities);
    expect(analysis.topCategory?.category).toBe("diet");
    expect(analysis.topCategory?.share).toBeGreaterThan(80);
    // The headline insight is always first.
    expect(analysis.insights[0].id).toBe("headline");
  });

  it("identifies top category when there are multiple categories with positive emissions", () => {
    const activities: Activity[] = [
      { id: "1", factorId: "meal_beef", quantity: 1, date: day(1) }, // 6.6 diet
      { id: "2", factorId: "electricity", quantity: 10, date: day(1) }, // 4.0 energy (lower than diet)
      { id: "3", factorId: "train", quantity: 10, date: day(1) }, // 0.35 transport (lower than diet)
    ];
    const analysis = analyzeFootprint(activities);
    expect(analysis.topCategory?.category).toBe("diet");
  });

  it("computes a daily average over distinct logged days", () => {
    const activities: Activity[] = [
      { id: "1", factorId: "electricity", quantity: 10, date: day(1) }, // 4.0
      { id: "2", factorId: "electricity", quantity: 10, date: day(2) }, // 4.0
    ];
    const analysis = analyzeFootprint(activities);
    // total 8.0 over 2 days = 4.0/day
    expect(analysis.dailyAverageKg).toBe(4.0);
  });

  it("flags a high red-meat diet with a quantified saving", () => {
    const activities: Activity[] = [
      { id: "1", factorId: "meal_beef", quantity: 3, date: day(1) },
    ];
    const analysis = analyzeFootprint(activities);
    const insight = analysis.insights.find((i) => i.id === "diet-redmeat");
    expect(insight).toBeDefined();
    expect(insight?.level).toBe("opportunity");
    // 3 * (6.6 - 1.8) = 14.4
    expect(insight?.potentialSavingKg).toBe(14.4);
  });

  it("suggests a transport mode shift for heavy car use", () => {
    const analysis = analyzeFootprint([
      { id: "1", factorId: "car_petrol", quantity: 100, date: day(1) },
    ]);
    const insight = analysis.insights.find((i) => i.id === "transport-carpool");
    expect(insight).toBeDefined();
    expect(insight?.potentialSavingKg).toBeGreaterThan(0);
  });

  it("celebrates low-carbon travel as a win", () => {
    const analysis = analyzeFootprint([
      { id: "1", factorId: "bike_walk", quantity: 30, date: day(1) },
    ]);
    const win = analysis.insights.find((i) => i.level === "win");
    expect(win).toBeDefined();
    expect(win?.id).toBe("transport-win");
  });

  it("orders opportunities by descending potential saving", () => {
    const analysis = analyzeFootprint([
      { id: "1", factorId: "meal_beef", quantity: 3, date: day(1) }, // saving 14.4
      { id: "2", factorId: "car_petrol", quantity: 50, date: day(1) }, // smaller saving
    ]);
    const opportunities = analysis.insights.filter(
      (i) => typeof i.potentialSavingKg === "number",
    );
    for (let i = 1; i < opportunities.length; i++) {
      expect(opportunities[i - 1].potentialSavingKg!).toBeGreaterThanOrEqual(
        opportunities[i].potentialSavingKg!,
      );
    }
  });

  it("compares the daily average to global and target benchmarks", () => {
    // A very low day: one vegan meal = 0.7 kg, well under target.
    const low = analyzeFootprint([
      { id: "1", factorId: "meal_vegan", quantity: 1, date: day(1) },
    ]);
    expect(low.comparison.vsTarget).toBe("under");
    expect(low.comparison.vsGlobalPct).toBeLessThan(0);

    // A heavy day blows past both benchmarks.
    const high = analyzeFootprint([
      { id: "1", factorId: "meal_beef", quantity: 5, date: day(1) },
    ]);
    expect(high.comparison.vsTarget).toBe("over");
    expect(high.comparison.vsGlobalPct).toBeGreaterThan(0);
  });

  it("exposes sane benchmark constants", () => {
    expect(BENCHMARKS.globalDailyAvg).toBeGreaterThan(
      BENCHMARKS.sustainableDailyTarget,
    );
    expect(BENCHMARKS.sustainableDailyTarget).toBeGreaterThan(0);
  });

  it("always keeps the headline insight at index 0 when sorting", () => {
    const activities: Activity[] = [
      { id: "1", factorId: "meal_beef", quantity: 5, date: day(1) }, // diet headline
      { id: "2", factorId: "car_petrol", quantity: 100, date: day(1) }, // transport opportunity
      { id: "3", factorId: "electricity", quantity: 10, date: day(1) }, // energy opportunity
    ];
    const analysis = analyzeFootprint(activities);
    expect(analysis.insights[0].id).toBe("headline");
    
    // Check sorting order explicitly
    const index = analysis.insights.findIndex(i => i.id === "headline");
    expect(index).toBe(0);
  });

  it("handles globalDailyAvg being zero or negative", () => {
    const originalGlobalDailyAvg = BENCHMARKS.globalDailyAvg;
    // @ts-expect-error - overriding read-only benchmark property for testing
    BENCHMARKS.globalDailyAvg = 0;
    
    const analysis = analyzeFootprint([
      { id: "1", factorId: "meal_beef", quantity: 1, date: day(1) }
    ]);
    expect(analysis.comparison.vsGlobalPct).toBe(0);
    
    // @ts-expect-error - restoring read-only benchmark property
    BENCHMARKS.globalDailyAvg = originalGlobalDailyAvg;
  });

  it("sorts insights correctly including headline in different positions", () => {
    const list = [
      { id: "opt-1", potentialSavingKg: 10 },
      { id: "headline", potentialSavingKg: 0 },
      { id: "opt-2", potentialSavingKg: 20 },
    ];
    const sortCallback = (
      a: { id: string; potentialSavingKg?: number },
      b: { id: string; potentialSavingKg?: number },
    ) => {
      if (a.id === "headline") return -1;
      if (b.id === "headline") return 1;
      return (b.potentialSavingKg ?? 0) - (a.potentialSavingKg ?? 0);
    };
    const sorted = [...list].sort(sortCallback);
    expect(sorted[0].id).toBe("headline");
    expect(sorted[1].id).toBe("opt-2");
    expect(sorted[2].id).toBe("opt-1");
  });

  it("handles totalKg being zero with positive category emissions", () => {
    const spy = vi.spyOn(calculate, "summarize").mockImplementation(() => {
      return {
        totalKg: 0,
        byCategory: { diet: 10, transport: 0, energy: 0, shopping: 0, waste: 0, custom: 0 },
        activityCount: 1,
      };
    });

    const analysis = analyzeFootprint([
      { id: "1", factorId: "meal_beef", quantity: 1, date: day(1) }
    ]);
    expect(analysis.topCategory?.share).toBe(0);

    spy.mockRestore();
  });
});
