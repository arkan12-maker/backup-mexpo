// src/shared/components/tabs/TabListShell.tsx
// Shared shell for the public event tab lists (Sponsors / Speakers / Tenant /
// Workshop / Contact / Agenda): page wrapper + ContentTitle2 header + SearchBar.
// Each tab keeps its own list/grid rendering inside `children`.

import { ReactNode } from "react";

import ContentTitle2 from "@/shared/components/ui/ContentTitle2";
import SearchBar from "@/shared/components/form/SearchBar";

interface TabListShellProps {
  category: string;
  title: string;
  searchPlaceholder: string;
  search: string;
  setSearch: (value: string) => void;
  children: ReactNode;
  className?: string;
  filterComponent?: ReactNode;
  sortComponent?: ReactNode;
  totalCount?: number;
}

export default function TabListShell({
  category,
  title,
  searchPlaceholder,
  search,
  setSearch,
  children,
  className,
  filterComponent,
  sortComponent,
  totalCount,
}: TabListShellProps) {
  return (
    <div
      className={`mx-auto px-2 sm:px-4 md:px-6 lg:px-0 w-full max-w-7xl animate-in duration-500 fade-in ${
        className ?? ""
      }`}
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <ContentTitle2 category={category} title={title} />
          {typeof totalCount === "number" && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-secondary border border-blue-100 self-start sm:self-auto">
              Total: {totalCount}
            </span>
          )}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder={searchPlaceholder}
            />
          </div>
          {sortComponent && (
            <div className="shrink-0">
              {sortComponent}
            </div>
          )}
        </div>

        {/* Filter Pills / Tabs */}
        {filterComponent && (
          <div className="overflow-x-auto pb-1 scrollbar-hide">
            {filterComponent}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}