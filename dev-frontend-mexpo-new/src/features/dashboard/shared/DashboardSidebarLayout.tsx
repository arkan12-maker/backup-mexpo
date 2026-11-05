"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LucideIcon, Menu, X, ChevronRight } from "lucide-react";

export type SidebarSubTab = {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  badgeColor?: string;
  disabled?: boolean;
  content?: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export type SidebarTabGroup = {
  id: string;
  label: string;
  subTabs: SidebarSubTab[];
  content?: React.ReactNode;
};

interface DashboardSidebarLayoutProps {
  groups: SidebarTabGroup[];
  defaultGroupId?: string;
  defaultSubTabId?: string;
  sidebarHeader?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  topHeader?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function DashboardSidebarLayout({
  groups,
  defaultGroupId,
  defaultSubTabId,
  sidebarHeader,
  sidebarFooter,
  topHeader,
  actions,
}: DashboardSidebarLayoutProps) {
  const [activeGroup, setActiveGroup] = useState<string>(
    defaultGroupId || groups[0]?.id || ""
  );
  const [activeSub, setActiveSub] = useState<string>(
    defaultSubTabId || groups[0]?.subTabs[0]?.id || ""
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentGroup = groups.find((g) => g.id === activeGroup);
  const currentSub = currentGroup?.subTabs.find((s) => s.id === activeSub);

  const handleSelectSubTab = (group: SidebarTabGroup, sub: SidebarSubTab) => {
    setActiveGroup(group.id);
    setActiveSub(sub.id);
    if (sub.onClick) sub.onClick();
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Optional Top Header (e.g. Rejection notice, Hero banner) */}
      {topHeader && <div className="w-full">{topHeader}</div>}

      {/* Mobile Drawer Trigger Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {currentSub?.icon && (
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <currentSub.icon className="w-4 h-4 text-secondary" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {currentGroup?.label}
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {currentSub?.label || "Pilih Menu"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileMenuOpen ? "Tutup" : "Menu"}</span>
        </button>
      </div>

      {/* Main 2-Column Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Sidebar (4 cols on lg, or mobile overlay) ── */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 flex flex-col space-y-6 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm transition-all ${
            mobileMenuOpen ? "block" : "hidden lg:flex"
          }`}
        >
          {/* Identity / Profile Header inside Sidebar */}
          {sidebarHeader && (
            <div className="pb-5 border-b border-gray-100">{sidebarHeader}</div>
          )}

          {/* Grouped Navigation Menu */}
          <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 scrollbar-thin">
            {groups.map((group) => (
              <div key={group.id} className="space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-3 py-1.5">
                  {group.label}
                </p>

                <div className="space-y-1">
                  {group.subTabs.map((sub) => {
                    const isActive =
                      activeGroup === group.id && activeSub === sub.id;
                    const Icon = sub.icon;

                    const innerContent = (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          {Icon && (
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? "text-white" : "text-gray-400"
                              }`}
                            />
                          )}
                          <span className="truncate">{sub.label}</span>
                        </div>

                        {sub.badge ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              isActive
                                ? "bg-white/20 text-white"
                                : sub.badgeColor || "bg-blue-50 text-secondary"
                            }`}
                          >
                            {sub.badge}
                          </span>
                        ) : isActive ? (
                          <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />
                        ) : null}
                      </>
                    );

                    const baseClass = `w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-secondary text-white shadow-xs"
                        : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                    } ${sub.disabled ? "opacity-40 cursor-not-allowed" : ""}`;

                    if (sub.href) {
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={() => {
                            if (sub.onClick) sub.onClick();
                            setMobileMenuOpen(false);
                          }}
                          className={baseClass}
                        >
                          {innerContent}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        disabled={sub.disabled}
                        onClick={() => handleSelectSubTab(group, sub)}
                        className={baseClass}
                      >
                        {innerContent}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer Actions */}
          {sidebarFooter && (
            <div className="pt-5 border-t border-gray-100 flex flex-col gap-2.5">
              {sidebarFooter}
            </div>
          )}
        </aside>

        {/* ── Right Content Area (8 cols on lg) ── */}
        <main className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-6">
          {/* Top Content Title Bar & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <span>{currentGroup?.label}</span>
                <span>/</span>
                <span className="font-semibold text-gray-700">
                  {currentSub?.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {currentSub?.label}
              </h1>
            </div>

            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          {/* Active Tab Content Panel */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentSub?.content || currentGroup?.content || (
              <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                Pilih menu di sidebar sebelah kiri untuk melihat konten.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
