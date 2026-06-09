"use client";

import { useState } from "react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { useHydrated } from "@/components/useHydrated";
import { useToast } from "@/components/ui";
import { PageSkeleton } from "@/components/app/shared/Skeletons";
import { todayISO } from "@/lib/store/helpers";

import { PRESETS } from "./log/log-constants";
import { useLogFilters } from "./log/useLogFilters";
import { useLogImportExport } from "./log/useLogImportExport";
import { LogDialogs } from "./log/LogDialogs";
import { LogPageHeader } from "./log/LogPageHeader";
import { LogActions } from "./log/LogActions";
import { LogContent } from "./log/LogContent";

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

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    impactFilter,
    setImpactFilter,
    selectedIds,
    filteredActivities,
    stats,
    handleToggleSelect,
    handleSelectAllFiltered,
    resetSelection,
  } = useLogFilters(activities);

  const {
    importFile,
    setImportFile,
    showImportDialog,
    setShowImportDialog,
    handleExport,
    handleFileChange,
    handleImport,
  } = useLogImportExport({
    activities,
    goal,
    addActivity,
    clearAll,
    setGoal,
  });

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

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => {
      removeActivity(id);
    });
    toast(`Purged ${selectedIds.size} telemetry records.`, "info");
    resetSelection();
  };

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="stagger pb-12">
      <LogPageHeader />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <LogActions setPendingPreset={setPendingPreset} />

        <LogContent
          filteredActivitiesLength={filteredActivities.length}
          totalActivitiesLength={activities.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          impactFilter={impactFilter}
          setImpactFilter={setImpactFilter}
          stats={stats}
          filteredActivities={filteredActivities}
          selectedIds={selectedIds}
          handleSelectAllFiltered={handleSelectAllFiltered}
          handleToggleSelect={handleToggleSelect}
          setConfirmBulkDelete={setConfirmBulkDelete}
          setConfirmClear={setConfirmClear}
          handleExport={handleExport}
          handleFileChange={handleFileChange}
        />
      </div>

      <LogDialogs
        confirmClear={confirmClear}
        setConfirmClear={setConfirmClear}
        clearAll={clearAll}
        toast={toast}
        pendingPreset={pendingPreset}
        setPendingPreset={setPendingPreset}
        handleQuickLog={handleQuickLog}
        confirmBulkDelete={confirmBulkDelete}
        setConfirmBulkDelete={setConfirmBulkDelete}
        selectedCount={selectedIds.size}
        handleBulkDelete={handleBulkDelete}
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        importFile={importFile}
        setImportFile={setImportFile}
        handleImport={handleImport}
      />
    </div>
  );
}
