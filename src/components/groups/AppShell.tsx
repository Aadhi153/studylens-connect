"use client";

import { Menu } from "lucide-react";
import { DrawerProvider, useDrawer } from "@/components/groups/DrawerContext";
import { IconRail } from "@/components/groups/IconRail";
import { GroupList } from "@/components/groups/GroupList";
import type { GroupPreview } from "@/components/groups/types";

function ShellInner({
  userEmail,
  groups,
  children,
}: {
  userEmail: string;
  groups: GroupPreview[];
  children: React.ReactNode;
}) {
  const { isOpen, close, toggle } = useDrawer();

  return (
    <div className="groups-page-bg flex h-screen overflow-hidden">
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 flex -translate-x-full transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        <IconRail userEmail={userEmail} />
        <GroupList groups={groups} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-app-border bg-app-card px-3 py-2 md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label="Open menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-app-text-secondary hover:bg-hover-overlay"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-medium text-app-text-primary">StudyLens Connect</span>
        </div>
        <div className="min-h-0 flex-1 bg-app-content-bg">{children}</div>
      </div>
    </div>
  );
}

export function AppShell({
  userEmail,
  groups,
  children,
}: {
  userEmail: string;
  groups: GroupPreview[];
  children: React.ReactNode;
}) {
  return (
    <DrawerProvider>
      <ShellInner userEmail={userEmail} groups={groups}>
        {children}
      </ShellInner>
    </DrawerProvider>
  );
}
