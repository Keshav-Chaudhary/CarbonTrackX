"use client";

import { Search } from "lucide-react";
import { Select } from "@/components/ui";
import { CATEGORY_OPTIONS, DATE_OPTIONS, IMPACT_OPTIONS } from "./log-constants";

interface FilterDeckProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  dateFilter: string;
  setDateFilter: (d: string) => void;
  impactFilter: string;
  setImpactFilter: (i: string) => void;
}

export function FilterDeck({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  dateFilter,
  setDateFilter,
  impactFilter,
  setImpactFilter,
}: FilterDeckProps) {
  return (
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
      <div className="z-45">
        <Select
          ariaLabel="Filter by Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={CATEGORY_OPTIONS}
          className="w-full"
        />
      </div>

      {/* Date Filter */}
      <div className="z-30">
        <Select
          ariaLabel="Filter by Date"
          value={dateFilter}
          onChange={setDateFilter}
          options={DATE_OPTIONS}
          className="w-full"
        />
      </div>

      {/* Impact Filter */}
      <div className="z-20">
        <Select
          ariaLabel="Filter by Impact"
          value={impactFilter}
          onChange={setImpactFilter}
          options={IMPACT_OPTIONS}
          className="w-full"
        />
      </div>
    </div>
  );
}
