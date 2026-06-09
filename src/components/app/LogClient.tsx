"use client";

import { useState, useMemo } from "react";
import {
  History,
  Trash2,
  Leaf,
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
  useToast,
} from "@/components/ui";
import { PageSkeleton } from "@/components/app/Skeletons";
import { todayISO } from "@/lib/store/helpers";
import { computeActivities } from "@/lib/emissions/calculate";
import { CATEGORY_META } from "@/lib/emissions/factors";

import { PRESETS } from "./log-constants";
import { QuickPresets } from "./QuickPresets";
import { StatisticsHUD } from "./StatisticsHUD";
import { DataPortability } from "./DataPortability";
import { EcoTipCard } from "./EcoTipCard";
import { FilterDeck } from "./FilterDeck";

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
          <QuickPresets onSelectPreset={(preset) => setPendingPreset(preset)} />
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
              <FilterDeck
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                impactFilter={impactFilter}
                setImpactFilter={setImpactFilter}
              />

              {/* Statistics HUD */}
              <StatisticsHUD
                filteredCount={filteredActivities.length}
                totalEmissions={stats.totalEmissions}
                maxImpact={stats.maxImpact}
                avgImpact={stats.avgImpact}
              />

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
            <DataPortability onExport={handleExport} onFileChange={handleFileChange} />
          </div>

          {/* Eco Tip Card */}
          <EcoTipCard />
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
