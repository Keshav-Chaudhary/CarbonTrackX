import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { FilterDeck } from "./FilterDeck";
import { LogStatistics } from "./LogStatistics";
import { LogTable } from "./LogTable";
import { GoalSetter } from "@/components/app/goals/GoalSetter";
import { DataPortability } from "@/components/app/settings/DataPortability";
import { EcoTipCard } from "@/components/app/shared/EcoTipCard";
import { EmptyLogState } from "./EmptyLogState";

interface LogContentProps {
  filteredActivitiesLength: number;
  totalActivitiesLength: number;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  dateFilter: string;
  setDateFilter: (s: string) => void;
  impactFilter: string;
  setImpactFilter: (s: string) => void;
  stats: { totalEmissions: number; maxImpact: number; avgImpact: number; };
  filteredActivities: import("@/lib/emissions/types").ComputedActivity[];
  selectedIds: Set<string>;
  handleSelectAllFiltered: () => void;
  handleToggleSelect: (id: string) => void;
  setConfirmBulkDelete: (b: boolean) => void;
  setConfirmClear: (b: boolean) => void;
  handleExport: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogContent({
  filteredActivitiesLength,
  totalActivitiesLength,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  dateFilter,
  setDateFilter,
  impactFilter,
  setImpactFilter,
  stats,
  filteredActivities,
  selectedIds,
  handleSelectAllFiltered,
  handleToggleSelect,
  setConfirmBulkDelete,
  setConfirmClear,
  handleExport,
  handleFileChange
}: LogContentProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-6">
      <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col">
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6 flex flex-row items-center justify-between border-b border-[var(--border-faint)] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
                <History className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-fg">Activity History</h2>
                <p className="text-sm text-fg-muted">
                  {filteredActivitiesLength} visible of {totalActivitiesLength} total recorded.
                </p>
              </div>
            </div>
            {totalActivitiesLength > 0 && (
              <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)} className="px-3 rounded-lg" title="Purge Database">
                <Trash2 aria-hidden="true" className="size-4 mr-2" /> Delete All
              </Button>
            )}
          </div>

          {totalActivitiesLength === 0 ? (
            <EmptyLogState />
          ) : (
            <>
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

              <LogStatistics
                filteredCount={filteredActivitiesLength}
                totalEmissions={stats.totalEmissions}
                maxImpact={stats.maxImpact}
                avgImpact={stats.avgImpact}
              />

              <LogTable
                filteredActivities={filteredActivities}
                selectedIds={selectedIds}
                handleSelectAllFiltered={handleSelectAllFiltered}
                onToggleSelect={handleToggleSelect}
                onBulkDeleteClick={() => setConfirmBulkDelete(true)}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GoalSetter />
        <DataPortability onExport={handleExport} onFileChange={handleFileChange} />
      </div>

      <EcoTipCard />
    </div>
  );
}
