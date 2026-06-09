"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { ActivityList } from "@/components/app/activity/ActivityList";
import type { ComputedActivity } from "@/lib/emissions/types";

interface LogTableProps {
  filteredActivities: ComputedActivity[];
  selectedIds: Set<string>;
  handleSelectAllFiltered: () => void;
  onToggleSelect: (id: string) => void;
  onBulkDeleteClick: () => void;
}

export function LogTable({
  filteredActivities,
  selectedIds,
  handleSelectAllFiltered,
  onToggleSelect,
  onBulkDeleteClick,
}: LogTableProps) {
  const allSelected =
    filteredActivities.length > 0 &&
    filteredActivities.every((act) => selectedIds.has(act.id));

  return (
    <>
      {/* Bulk Selection Actions */}
      {filteredActivities.length > 0 && (
        <div className="flex items-center justify-between gap-4 p-3 bg-surface-3 border-b border-[var(--border-faint)] text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none text-fg-subtle">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAllFiltered}
              className="size-4 rounded border-[var(--border-strong)] bg-surface-1 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer accent-[var(--accent)]"
            />
            Select all visible
          </label>
          {selectedIds.size > 0 && (
            <Button variant="danger" size="sm" onClick={onBulkDeleteClick}>
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
          onToggleSelect={onToggleSelect}
        />
      </div>
    </>
  );
}
