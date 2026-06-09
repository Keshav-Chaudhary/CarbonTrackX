"use client";

import { useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { computeActivities } from "@/lib/emissions/calculate";
import { CATEGORY_META } from "@/lib/emissions/factors";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { formatKg, Dialog, Button } from "@/components/ui";
import { FACTOR_ICON, CATEGORY_COLOR_VAR } from "@/components/charts/icons";
import type { ComputedActivity } from "@/lib/emissions/types";
import { ActivityForm } from "./ActivityForm";

/**
 * List of logged activities, newest first, each with a remove control whose
 * accessible name identifies the specific entry. An optional `limit` trims the
 * list for compact dashboard placement. Supports checkboxes for bulk actions.
 */
export function ActivityList({
  limit,
  customActivities,
  selectedIds,
  onToggleSelect,
}: {
  limit?: number;
  customActivities?: ComputedActivity[];
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  const activities = useCarbonStore((s) => s.activities);
  const removeActivity = useCarbonStore((s) => s.removeActivity);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const computed = customActivities ?? computeActivities(activities);
  const shown = limit ? computed.slice(0, limit) : computed;
  const editingActivity = editingId ? activities.find(a => a.id === editingId) : null;
  const deletingActivity = deletingId ? computed.find(a => a.id === deletingId) : null;

  if (shown.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-fg-muted">
        No activities found.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3" aria-label="Logged activities">
      {shown.map((activity) => {
        const Icon = FACTOR_ICON[activity.factorId] ?? FACTOR_ICON.electricity;
        const isSelected = selectedIds?.has(activity.id) || false;
        return (
          <li
            key={activity.id}
            className={`group flex items-center gap-4 rounded-xl border px-4 py-3 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] ${
              isSelected
                ? "border-[var(--accent-line)] bg-[var(--accent-subtle)]"
                : "border-[var(--border-faint)] bg-surface-3"
            }`}
          >
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(activity.id)}
                className="size-4 shrink-0 rounded border-[var(--border-strong)] bg-surface-1 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer accent-[var(--accent)]"
                aria-label={`Select ${activity.label}`}
              />
            )}
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-[var(--r-md)] bg-surface-2"
            >
              <Icon
                className="size-4"
                style={{ color: CATEGORY_COLOR_VAR[activity.category] }}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">
                {activity.label}
              </p>
              <p className="text-xs text-fg-subtle">
                {activity.quantity} {activity.unit} ·{" "}
                {CATEGORY_META[activity.category]?.label ?? activity.category} · {activity.date}
                {activity.note && ` · "${activity.note}"`}
              </p>
            </div>
            <span className="tnum text-sm font-medium text-fg whitespace-nowrap">
              {formatKg(activity.kgCO2e)}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEditingId(activity.id)}
                aria-label={`Edit ${activity.label} on ${activity.date}`}
                className="rounded-[var(--r-sm)] p-1.5 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg cursor-pointer"
              >
                <Edit2 aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(activity.id)}
                aria-label={`Remove ${activity.label} on ${activity.date}`}
                className="rounded-[var(--r-sm)] p-1.5 text-fg-subtle transition-colors hover:bg-[var(--critical-subtle)] hover:text-[var(--critical)] cursor-pointer"
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </button>
            </div>
          </li>
        );
      })}

      <Dialog 
        open={!!editingActivity} 
        onClose={() => setEditingId(null)} 
        title="Edit Activity"
      >
        {editingActivity && (
          <ActivityForm 
            initialData={editingActivity} 
            onLogged={() => setEditingId(null)} 
          />
        )}
      </Dialog>

      <Dialog
        open={!!deletingActivity}
        onClose={() => setDeletingId(null)}
        title="Delete activity?"
        description={`Are you sure you want to delete "${deletingActivity?.label}"? This action cannot be undone.`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deletingId) {
                removeActivity(deletingId);
                setDeletingId(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </ul>
  );
}

