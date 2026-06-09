"use client";

import { useState, useMemo, useCallback } from "react";
import type { Activity } from "@/lib/emissions/types";
import { computeActivities } from "@/lib/emissions/calculate";
import { CATEGORY_META } from "@/lib/emissions/factors";
import { todayISO } from "@/lib/store/helpers";

export function useLogFilters(activities: Activity[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const computedActivities = useMemo(() => {
    return computeActivities(activities);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return computedActivities.filter((activity) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesLabel = activity.label.toLowerCase().includes(query);
        const matchesCategory =
          CATEGORY_META[activity.category]?.label?.toLowerCase().includes(query) ?? false;
        if (!matchesLabel && !matchesCategory) return false;
      }

      if (selectedCategory !== "all" && activity.category !== selectedCategory) {
        return false;
      }

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

      if (impactFilter !== "all") {
        const kg = activity.kgCO2e;
        if (impactFilter === "low" && kg >= 1) return false;
        if (impactFilter === "medium" && (kg < 1 || kg > 10)) return false;
        if (impactFilter === "high" && kg <= 10) return false;
      }

      return true;
    });
  }, [computedActivities, searchQuery, selectedCategory, dateFilter, impactFilter]);

  const stats = useMemo(() => {
    const totalEmissions = filteredActivities.reduce((sum, act) => sum + act.kgCO2e, 0);
    const maxImpact =
      filteredActivities.length > 0 ? Math.max(...filteredActivities.map((act) => act.kgCO2e)) : 0;
    const avgImpact = filteredActivities.length > 0 ? totalEmissions / filteredActivities.length : 0;
    return {
      totalEmissions,
      maxImpact,
      avgImpact,
    };
  }, [filteredActivities]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAllFiltered = useCallback(() => {
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
  }, [filteredActivities, selectedIds]);

  const resetSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    impactFilter,
    setImpactFilter,
    selectedIds,
    setSelectedIds,
    filteredActivities,
    stats,
    handleToggleSelect,
    handleSelectAllFiltered,
    resetSelection,
  };
}
