"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LucideIcon,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

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
  activeGroupId?: string;
  activeSubTabId?: string;
  onTabChange?: (groupId: string, subTabId: string) => void;
  sidebarHeader?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  topHeader?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export default function DashboardSidebarLayout({
  groups,
  defaultGroupId,
  defaultSubTabId,
  activeGroupId,
  activeSubTabId,
  onTabChange,
  sidebarHeader,
  sidebarFooter,
  topHeader,
  actions,
  backHref = "/dashboard",
  backLabel = "Kembali ke Dashboard",
}: DashboardSidebarLayoutProps) {
  const [internalGroup, setInternalGroup] = useState<string>(
    defaultGroupId || groups[0]?.id || ""
  );
  const [internalSub, setInternalSub] = useState<string>(
    defaultSubTabId || groups[0]?.subTabs[0]?.id || ""
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeGroup = activeGroupId ?? internalGroup;
  const activeSub = activeSubTabId ?? internalSub;

  const currentGroup = groups.find((g) => g.id === activeGroup) || groups[0];
  const currentSub = currentGroup?.subTabs.find((s) => s.id === activeSub) || currentGroup?.subTabs[0];

  const handleSelectSubTab = (group: SidebarTabGroup, sub: SidebarSubTab) => {
    if (activeGroupId === undefined) setInternalGroup(group.id);
    if (activeSubTabId === undefined) setInternalSub(sub.id);
    if (onTabChange) onTabChange(group.id, sub.id);
    if (sub.onClick) sub.onClick();
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* ── Mobile Backdrop ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Left Sticky & Collapsible Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 shadow-md lg:shadow-none lg:static lg:h-full transition-all duration-300 ease-in-out shrink-0 ${
          // Mobile open/close
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        } ${
          // Desktop collapsed/expanded
          isCollapsed ? "lg:w-[76px]" : "lg:w-64 xl:w-72"
        }`}
      >
        {/* Sidebar Top: Back Button + Collapse Toggle */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          <Link
            href={backHref}
            title={backLabel}
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-secondary hover:bg-blue-50 transition-colors ${
              isCollapsed ? "justify-center w-full px-0" : ""
            }`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{backLabel}</span>}
          </Link>

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title={isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Close Button on Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Header (Identity / Role / Event badge) */}
        {sidebarHeader && (
          <div
            className={`p-4 border-b border-slate-100 shrink-0 ${
              isCollapsed ? "hidden lg:block lg:p-2 lg:text-center" : ""
            }`}
          >
            {!isCollapsed ? (
              sidebarHeader
            ) : (
              <div className="flex justify-center" title="Mexpo Management">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
                  M
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          {groups.map((group) => (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1.5 truncate">
                  {group.label}
                </p>
              )}

              {isCollapsed && (
                <div className="h-px bg-slate-100 mx-2 my-2" title={group.label} />
              )}

              <div className="space-y-1">
                {group.subTabs.map((sub) => {
                  const isActive =
                    activeGroup === group.id && activeSub === sub.id;
                  const Icon = sub.icon;

                  const buttonContent = (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        {Icon && (
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? "text-white" : "text-slate-400"
                            }`}
                          />
                        )}
                        {!isCollapsed && (
                          <span className="truncate text-xs font-semibold">
                            {sub.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && sub.badge ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : sub.badgeColor || "bg-blue-50 text-secondary"
                          }`}
                        >
                          {sub.badge}
                        </span>
                      ) : !isCollapsed && isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />
                      ) : null}
                    </>
                  );

                  const commonClasses = `w-full flex items-center ${
                    isCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2.5"
                  } rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-secondary text-white shadow-xs font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } ${sub.disabled ? "opacity-40 cursor-not-allowed" : ""}`;

                  if (sub.href) {
                    return (
                      <Link
                        key={sub.id}
                        href={sub.href}
                        title={sub.label}
                        onClick={() => {
                          if (sub.onClick) sub.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className={commonClasses}
                      >
                        {buttonContent}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      title={sub.label}
                      disabled={sub.disabled}
                      onClick={() => handleSelectSubTab(group, sub)}
                      className={commonClasses}
                    >
                      {buttonContent}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer (Aksi cepat / Log) */}
        {sidebarFooter && !isCollapsed && (
          <div className="p-4 border-t border-slate-100 shrink-0 flex flex-col gap-2">
            {sidebarFooter}
          </div>
        )}
      </aside>

      {/* ── Main Full-Screen Content Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-50">
        {/* Top Navbar Header inside Dashboard */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb info */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{currentGroup?.label}</span>
                <span>/</span>
                <span className="text-secondary">{currentSub?.label}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                {currentSub?.label}
              </h2>
            </div>
          </div>

          {/* Action buttons on the right of top bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-7xl mx-auto space-y-6">
            {topHeader && <div className="w-full">{topHeader}</div>}

            {/* Active Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {currentSub?.content || currentGroup?.content || (
                <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">
                  Pilih menu di sidebar sebelah kiri untuk melihat konten.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
