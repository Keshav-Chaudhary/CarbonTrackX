"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_META,
  EMISSION_FACTORS,
  getFactor,
} from "@/lib/emissions/factors";
import { computeActivity } from "@/lib/emissions/calculate";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { todayISO } from "@/lib/store/helpers";
import { formatKg } from "@/components/ui";
import { Button, Field, Input, Select, useToast, type SelectOption } from "@/components/ui";

/** Build grouped select options from the emission factors. */
const FACTOR_OPTIONS: SelectOption[] = CATEGORIES.flatMap((category) =>
  EMISSION_FACTORS.filter((f) => f.category === category).map((f) => ({
    value: f.id,
    label: f.label,
    group: CATEGORY_META[category].label,
  })),
);

/**
 * Form for logging a new activity. Uses the custom accessible Select (no native
 * dropdown), wires labels/hints/errors via the Field scaffold, shows a live
 * estimate of the resulting emissions, and confirms success with a toast.
 */
export function ActivityForm({ onLogged, initialData }: { onLogged?: () => void, initialData?: { id: string, factorId: string, quantity: number, date: string, note?: string } }) {
  const addActivity = useCarbonStore((s) => s.addActivity);
  const updateActivity = useCarbonStore((s) => s.updateActivity);
  const { toast } = useToast();

  const [factorId, setFactorId] = useState(initialData?.factorId ?? EMISSION_FACTORS[0].id);
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() ?? "");
  const [date, setDate] = useState(() => initialData?.date ?? todayISO());
  const [note, setNote] = useState(initialData?.note ?? "");
  const [error, setError] = useState<string | undefined>();

  const factor = useMemo(() => getFactor(factorId), [factorId]);

  // Live preview of the emissions this entry would add.
  const preview = useMemo(() => {
    const n = Number(quantity);
    if (!quantity.trim() || Number.isNaN(n) || n < 0) return null;
    const computed = computeActivity({
      id: "preview",
      factorId,
      quantity: n,
      date,
    });
    return computed?.kgCO2e ?? null;
  }, [quantity, factorId, date]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const numeric = Number(quantity);
    if (quantity.trim() === "" || Number.isNaN(numeric)) {
      setError("Enter a quantity as a number.");
      return;
    }
    const result = initialData 
      ? updateActivity(initialData.id, { factorId, quantity: numeric, date, note: note.trim() || undefined })
      : addActivity({ factorId, quantity: numeric, date, note: note.trim() || undefined });
      
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(undefined);
    toast(
      `Logged ${numeric} ${factor?.unit ?? "unit"} of ${factor?.label ?? "activity"}.`,
    );
    setQuantity("");
    setNote("");
    onLogged?.();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 min-w-0">
      <div className="rounded-xl border border-[var(--border-strong)] bg-surface-1 p-5 shadow-inner flex flex-col gap-5 min-w-0">
        <Field label="What did you do?" hint={factor?.hint}>
          {({ id, "aria-describedby": describedBy }) => (
            <Select
              id={id}
              ariaDescribedBy={describedBy}
              options={FACTOR_OPTIONS}
              value={factorId}
              onChange={setFactorId}
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={`How much?${factor ? ` (${factor.unit})` : ""}`}
            error={error}
          >
            {(ids) => (
              <Input
                {...ids}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 12"
                className="tnum"
              />
            )}
          </Field>

          <Field label="When?">
            {(ids) => (
              <Input
                {...ids}
                type="date"
                value={date}
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
            )}
          </Field>
        </div>

        <Field label="Add a personal note (optional)" error={error && error.includes("Note") ? error : undefined}>
          {(ids) => (
            <Input
              {...ids}
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Drove to mom's house"
              maxLength={280}
            />
          )}
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[var(--accent-line)] bg-[var(--accent-subtle)] p-4 shadow-sm">
        <p className="text-sm text-fg" aria-live="polite">
          {preview !== null ? (
            <>
              Impact:{" "}
              <span className="tnum font-bold text-[var(--accent)] text-base">
                {formatKg(preview)} CO2e
              </span>
            </>
          ) : (
            <span className="text-fg-subtle italic">Waiting for input...</span>
          )}
        </p>
        <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-[var(--shadow-md)] hover:scale-105 active:scale-95 transition-transform">
          <Plus aria-hidden="true" className="size-4" />
          {initialData ? "Save changes" : "Save Activity"}
        </Button>
      </div>
    </form>
  );
}
