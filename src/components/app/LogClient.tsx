"use client";

import { useState, useMemo, useEffect } from "react";
import {
  History,
  Trash2,
  Database,
  Download,
  Upload,
  Search,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { useHydrated } from "@/components/useHydrated";
import { PageHeader } from "@/components/app/PageHeader";
import { ActivityForm } from "@/components/app/ActivityForm";
import { ActivityList } from "@/components/app/ActivityList";
import { GoalSetter } from "@/components/app/GoalSetter";
import {
  Button,

  Dialog,
  Select,
  useToast,
  formatKg,
} from "@/components/ui";
import { PageSkeleton } from "@/components/app/Skeletons";
import { todayISO } from "@/lib/store/helpers";
import { computeActivities } from "@/lib/emissions/calculate";
import { CATEGORY_META } from "@/lib/emissions/factors";

import {
  Car,
  Zap,
  Utensils,
  Leaf,
  Trash,
  Bike
} from "lucide-react";

const PRESETS = [
  { label: "Car Commute", factorId: "car_petrol", quantity: 20, icon: Car, desc: "20 km (Petrol)" },
  { label: "Electricity Day", factorId: "electricity", quantity: 10, icon: Zap, desc: "10 kWh" },
  { label: "Beef Meal", factorId: "meal_beef", quantity: 1, icon: Utensils, desc: "1 serving" },
  { label: "Vegan Meal", factorId: "meal_vegan", quantity: 1, icon: Leaf, desc: "1 serving" },
  { label: "General Waste", factorId: "waste_general", quantity: 5, icon: Trash, desc: "5 kg" },
  { label: "Zero-Emission Commute", factorId: "bike_walk", quantity: 10, icon: Bike, desc: "10 km" },
];

const ECO_TIPS = [
  "Small changes make a huge difference. Replacing just one beef meal a week with a plant-based option can save roughly 100 kg of CO2e per year—the equivalent of driving a petrol car for 400 kilometers!",
  "Unplugging inactive electronics, often called 'vampire power', can reduce your home energy footprint by up to 10%.",
  "Opting for public transit or carpooling just twice a week can significantly reduce your daily commuting emissions over a year.",
  "Washing clothes in cold water saves up to 90% of the energy used by your washing machine and keeps clothes looking new.",
  "Reducing food waste is one of the most effective ways to lower your personal footprint—the average household wastes 30% of its food.",
  "A leaky faucet that drips at the rate of one drop per second can waste more than 3,000 gallons per year, increasing water heating emissions.",
  "Switching to LED lightbulbs uses at least 75% less energy and lasts 25 times longer than incandescent lighting.",
  "Taking a 5-minute shower instead of a bath can save up to 50 gallons of water and drastically lower heating emissions.",
  "Bringing your own reusable bags to the grocery store reduces the demand for single-use plastics, which are highly emission-intensive to produce.",
  "Lowering your thermostat by just 2 degrees in the winter can cut your heating emissions by up to 10% without sacrificing comfort."
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "transport", label: "Transport" },
  { value: "energy", label: "Home Energy" },
  { value: "diet", label: "Diet" },
  { value: "shopping", label: "Shopping" },
  { value: "waste", label: "Waste" },
  { value: "custom", label: "Custom" },
];

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
];

const IMPACT_OPTIONS = [
  { value: "all", label: "All Impacts" },
  { value: "low", label: "Low (< 1kg)" },
  { value: "medium", label: "Medium (1 - 10kg)" },
  { value: "high", label: "High (> 10kg)" },
];

export function LogClient() {
  const hydrated = useHydrated();
  const activities = useCarbonStore((s) => s.activities);
  const addActivity = useCarbonStore((s) => s.addActivity);
  const removeActivity = useCarbonStore((s) => s.removeActivity);
  const clearAll = useCarbonStore((s) => s.clearAll);
  const goal = useCarbonStore((s) => s.goal);
  const setGoal = useCarbonStore((s) => s.setGoal);

  const { toast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<typeof PRESETS[number] | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");

  // Eco tip animation state
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

  // Selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Compute activities list
  const computedActivities = useMemo(() => {
    return computeActivities(activities);
  }, [activities]);

  // Apply filters
  const filteredActivities = useMemo(() => {
    return computedActivities.filter((activity) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesLabel = activity.label.toLowerCase().includes(query);
        const matchesCategory = CATEGORY_META[activity.category]?.label?.toLowerCase().includes(query) ?? false;
        if (!matchesLabel && !matchesCategory) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "all" && activity.category !== selectedCategory) {
        return false;
      }

      // 3. Date Filter
      if (dateFilter !== "all") {
        const todayStr = todayISO();
        const activityDate = new Date(activity.date);
        const todayDate = new Date(todayStr);
        const diffTime = todayDate.getTime() - activityDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === "today" && activity.date !== todayStr) {
          return false;
        }
        if (dateFilter === "7days" && diffDays > 7) {
          return false;
        }
        if (dateFilter === "30days" && diffDays > 30) {
          return false;
        }
      }

      // 4. Impact Filter
      if (impactFilter !== "all") {
        const kg = activity.kgCO2e;
        if (impactFilter === "low" && kg >= 1) return false;
        if (impactFilter === "medium" && (kg < 1 || kg > 10)) return false;
        if (impactFilter === "high" && kg <= 10) return false;
      }

      return true;
    });
  }, [computedActivities, searchQuery, selectedCategory, dateFilter, impactFilter]);

  // Statistics derived from filtered list
  const stats = useMemo(() => {
    const totalEmissions = filteredActivities.reduce((sum, act) => sum + act.kgCO2e, 0);
    const maxImpact = filteredActivities.length > 0 ? Math.max(...filteredActivities.map((act) => act.kgCO2e)) : 0;
    const avgImpact = filteredActivities.length > 0 ? totalEmissions / filteredActivities.length : 0;
    return {
      totalEmissions,
      maxImpact,
      avgImpact,
    };
  }, [filteredActivities]);

  // Handlers
  const handleQuickLog = (preset: typeof PRESETS[number]) => {
    const result = addActivity({
      factorId: preset.factorId,
      quantity: preset.quantity,
      date: todayISO(),
    });
    if (result.ok) {
      toast(`Quick-logged: ${preset.label} (${preset.desc})`);
    } else {
      toast(result.error || "Failed to log preset", "error");
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    const allFilteredSelected = filteredActivities.every((act) => selectedIds.has(act.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredActivities.forEach((act) => next.delete(act.id));
      } else {
        filteredActivities.forEach((act) => next.add(act.id));
      }
      return next;
    });
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => {
      removeActivity(id);
    });
    toast(`Purged ${selectedIds.size} telemetry records.`, "info");
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    try {
      const data = {
        activities,
        goal,
        exportedAt: new Date().toISOString(),
        version: 1,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `carbontrackx_telemetry_export_${todayISO()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast("Telemetry ledger exported successfully.");
    } catch {
      toast("Failed to export telemetry data.", "error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportDialog(true);
    }
    e.target.value = "";
  };

  const handleImport = (file: File, mode: "merge" | "overwrite") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data || (!Array.isArray(data.activities) && !Array.isArray(data))) {
          toast("Invalid JSON format: Expected activities array.", "error");
          return;
        }

        const importedActivities = Array.isArray(data) ? data : data.activities;
        const importedGoal = data.goal;

        if (mode === "overwrite") {
          clearAll();
        }

        let successCount = 0;
        let failCount = 0;

        type ImportedActivity = {
          factorId?: string;
          quantity?: number;
          date?: string;
          note?: string;
        };

        importedActivities.forEach((act: ImportedActivity) => {
          if (typeof act.factorId === "string" && typeof act.quantity === "number" && typeof act.date === "string") {
            const res = addActivity({
              factorId: act.factorId,
              quantity: act.quantity,
              date: act.date,
              note: typeof act.note === "string" ? act.note : undefined,
            });
            if (res.ok) successCount++;
            else failCount++;
          } else {
            failCount++;
          }
        });

        if (importedGoal && typeof importedGoal.dailyTargetKg === "number") {
          setGoal(importedGoal.dailyTargetKg);
        }

        toast(
          `Import complete. Success: ${successCount}. Failures/Skipped: ${failCount}.`,
          failCount > 0 ? "error" : "info"
        );
      } catch {
        toast("Failed to parse JSON file.", "error");
      }
    };
    reader.readAsText(file);
  };

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="stagger pb-12">
      <PageHeader
        eyebrow="Activity Log"
        title="Record your footprint"
        description="Log your daily activities to track your environmental impact."
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Data Input (Presets & Manual Forms) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Standard Log Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
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

          {/* Quick Presets */}
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-faint)] pb-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
                  <Sparkles className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-fg">Quick Log Presets</h2>
                  <p className="text-sm text-fg-muted">One-click templates to instantly log routine actions.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPendingPreset(preset)}
                    className="flex flex-col items-start text-left p-4 rounded-xl border border-[var(--border-strong)] bg-surface-3 hover:border-[var(--accent-line)] hover:bg-[var(--accent-subtle)] transition-all cursor-pointer group/btn"
                  >
                    <preset.icon className="size-5 mb-2 text-[var(--accent)] group-hover/btn:scale-110 transition-transform" />
                    <span className="block text-sm font-semibold text-fg">{preset.label}</span>
                    <span className="block text-xs text-fg-subtle">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ledger Log & Configuration */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Telemetry Log */}
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6 flex flex-row items-center justify-between border-b border-[var(--border-faint)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
                    <History className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-fg">Activity History</h2>
                    <p className="text-sm text-fg-muted">
                      {filteredActivities.length} visible of {activities.length} total recorded.
                    </p>
                  </div>
                </div>
                {activities.length > 0 && (
                  <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)} className="px-3 rounded-lg" title="Purge Database">
                    <Trash2 aria-hidden="true" className="size-4 mr-2" /> Delete All
                  </Button>
                )}
              </div>
            {/* Filter Deck */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 p-4 bg-surface-3 border-b border-[var(--border-faint)]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-fg-subtle" />
                <input
                  type="text"
                  placeholder="Search ledger..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-[var(--border-strong)] bg-surface-1 text-sm text-fg placeholder:text-fg-subtle focus:!outline-none focus-visible:!outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="z-40">
                <Select
                  ariaLabel="Filter by Category"
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                  options={CATEGORY_OPTIONS}
                  className="w-full"
                />
              </div>

              {/* Date Filter */}
              <div className="z-30">
                <Select
                  ariaLabel="Filter by Date"
                  value={dateFilter}
                  onChange={(val) => setDateFilter(val)}
                  options={DATE_OPTIONS}
                  className="w-full"
                />
              </div>

              {/* Impact Filter */}
              <div className="z-20">
                <Select
                  ariaLabel="Filter by Impact"
                  value={impactFilter}
                  onChange={(val) => setImpactFilter(val)}
                  options={IMPACT_OPTIONS}
                  className="w-full"
                />
              </div>
            </div>

            {/* Statistics HUD */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-surface-2 border-b border-[var(--border-faint)] text-xs text-fg-subtle">
              <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
                <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Filtered Count</span>
                <span className="block text-lg font-semibold text-fg mt-0.5 tnum">{filteredActivities.length}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
                <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Emissions Sum</span>
                <span className="block text-lg font-semibold text-[var(--accent)] mt-0.5 tnum">{formatKg(stats.totalEmissions)}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
                <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Peak Activity</span>
                <span className="block text-lg font-semibold text-fg mt-0.5 tnum">{formatKg(stats.maxImpact)}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-3 border border-[var(--border-faint)]">
                <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Average Impact</span>
                <span className="block text-lg font-semibold text-fg mt-0.5 tnum">{formatKg(stats.avgImpact)}</span>
              </div>
            </div>

            {/* Bulk Selection Actions */}
            {filteredActivities.length > 0 && (
              <div className="flex items-center justify-between gap-4 p-3 bg-surface-3 border-b border-[var(--border-faint)] text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none text-fg-subtle">
                  <input
                    type="checkbox"
                    checked={filteredActivities.length > 0 && filteredActivities.every((act) => selectedIds.has(act.id))}
                    onChange={handleSelectAllFiltered}
                    className="size-4 rounded border-[var(--border-strong)] bg-surface-1 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer accent-[var(--accent)]"
                  />
                  Select all visible
                </label>
                {selectedIds.size > 0 && (
                  <Button variant="danger" size="sm" onClick={() => setConfirmBulkDelete(true)}>
                    <Trash2 className="size-4 mr-1.5" />
                    Purge Selected ({selectedIds.size})
                  </Button>
                )}
              </div>
            )}

            <div className="pt-4 flex-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              <ActivityList
                customActivities={filteredActivities}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            </div>
          </div>
        </div>

          {/* Settings Sub-grid to utilize right-side space and balance columns */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Goal Target Config */}
            <GoalSetter />

            {/* Data Portability */}
            <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col h-fit">
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-faint)] pb-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
                    <Database aria-hidden="true" className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-fg">Data Portability</h2>
                    <p className="text-sm text-fg-muted">Backup your ledger or upload an existing backup.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full justify-center whitespace-nowrap rounded-xl h-10 border-[var(--border-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)]" onClick={handleExport}>
                    <Download className="size-4 mr-2" />
                    Export JSON
                  </Button>
                  <label className="group relative overflow-hidden rounded-xl border border-[var(--border-faint)] bg-surface-2 p-6 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col h-fit cursor-pointer">
                    <span className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                      <Upload className="size-4 text-[var(--accent)]" />
                      Import Data
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Restore activities from a JSON file.
                    </span>
                    <span className="mt-4 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl border border-[var(--border-strong)] bg-transparent px-4 text-sm font-semibold text-gray-900 dark:text-white transition-all hover:border-[var(--fg-subtle)] hover:bg-surface-2">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Eco Tip Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--accent-subtle)] blur-[40px] pointer-events-none transition-all group-hover:scale-150" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-4 flex items-center gap-2">
                <Lightbulb className="size-5 text-[var(--accent)] animate-pulse" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Did you know?</h2>
              </div>
              <div className="h-[120px] relative mt-2">
                <p 
                  className={`absolute inset-x-0 top-0 text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed transition-all duration-500 ease-in-out ${
                    fadeTip ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                >
                  &quot;{ECO_TIPS[currentTipIndex]}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* dialog for clear all */}
      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Delete all activity logs?"
        description="This will permanently delete all your recorded activities and reset your daily goal. This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clearAll();
              setConfirmClear(false);
              toast("All activity logs have been deleted.", "info");
            }}
          >
            Delete All
          </Button>
        </div>
      </Dialog>

      {/* dialog for preset confirmation */}
      <Dialog
        open={!!pendingPreset}
        onClose={() => setPendingPreset(null)}
        title={`Add ${pendingPreset?.label}?`}
        description={`This will log an activity of ${pendingPreset?.desc} to your history today, which will increase your total carbon footprint. Do you want to proceed?`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setPendingPreset(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (pendingPreset) {
                handleQuickLog(pendingPreset);
                setPendingPreset(null);
              }
            }}
          >
            Add Activity
          </Button>
        </div>
      </Dialog>

      {/* dialog for bulk delete */}
      <Dialog
        open={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        title="Delete selected logs?"
        description={`This will permanently delete the ${selectedIds.size} selected activities from your history. This action cannot be undone.`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setConfirmBulkDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleBulkDelete();
              setConfirmBulkDelete(false);
            }}
          >
            Delete Selected
          </Button>
        </div>
      </Dialog>

      {/* dialog for import selection */}
      <Dialog
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
          setImportFile(null);
        }}
        title="Import Telemetry Data"
        description={importFile ? `Importing from "${importFile.name}"` : ""}
      >
        <p className="text-sm text-fg-muted">
          Choose how you want to load these records into your local database:
        </p>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant="ghost"
            className="justify-start text-left py-3 px-4 border border-[var(--border-strong)] bg-surface-3 hover:bg-[var(--accent-subtle)] hover:border-[var(--accent-line)]"
            onClick={() => {
              if (importFile) {
                handleImport(importFile, "merge");
                setShowImportDialog(false);
                setImportFile(null);
              }
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-fg">Merge with Current Data</span>
              <span className="text-xs text-fg-subtle">Keep all existing logged telemetry and append new entries.</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left py-3 px-4 border border-[var(--border-strong)] bg-surface-3 hover:bg-[var(--critical-subtle)] hover:border-[var(--critical)]"
            onClick={() => {
              if (importFile) {
                handleImport(importFile, "overwrite");
                setShowImportDialog(false);
                setImportFile(null);
              }
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-fg">Overwrite Existing Data</span>
              <span className="text-xs text-fg-subtle">Wipe the local database and replace it completely with the file data.</span>
            </div>
          </Button>
        </div>
        <div className="flex justify-end gap-3 mt-4 border-t border-[var(--border-faint)] pt-3">
          <Button
            variant="ghost"
            onClick={() => {
              setShowImportDialog(false);
              setImportFile(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
