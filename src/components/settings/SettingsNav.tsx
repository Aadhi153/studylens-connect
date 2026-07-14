"use client";

import { motion } from "framer-motion";
import { User, Shield, SlidersHorizontal, Palette, AlertTriangle } from "lucide-react";
import type { SettingsSection } from "@/components/settings/SettingsSections";

const NAV_ITEMS: { value: SettingsSection; label: string; icon: typeof User }[] = [
  { value: "profile", label: "Profile", icon: User },
  { value: "account", label: "Account", icon: Shield },
  { value: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { value: "appearance", label: "Appearance", icon: Palette },
];

const navContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

export function SettingsNav({
  active,
  onSelect,
}: {
  active: SettingsSection;
  onSelect: (section: SettingsSection) => void;
}) {
  return (
    <nav className="flex h-full w-full flex-col border-b border-settings-border bg-settings-panel-bg backdrop-blur-xl md:w-[180px] md:shrink-0 md:border-b-0 md:border-r">
      <p className="px-4 pb-3 pt-5 text-lg font-semibold text-settings-text-primary md:px-5">
        Settings
      </p>

      <motion.div
        className="flex flex-1 flex-col"
        variants={navContainerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col gap-0.5 px-2 md:px-3">
          {NAV_ITEMS.map(({ value, label, icon: Icon }) => {
            const isActive = active === value;
            return (
              <motion.button
                key={value}
                type="button"
                onClick={() => onSelect(value)}
                aria-current={isActive ? "true" : undefined}
                variants={navItemVariants}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "text-white"
                    : "text-settings-text-secondary hover:bg-white/5 hover:text-settings-text-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-lg bg-settings-accent transition-colors duration-300"
                    style={{ zIndex: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
                <Icon size={17} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-auto px-2 pb-4 md:px-3">
          <div className="mx-1 mb-2 h-px bg-settings-border" />
          <motion.button
            type="button"
            onClick={() => onSelect("danger")}
            aria-current={active === "danger" ? "true" : undefined}
            variants={navItemVariants}
            whileTap={{ scale: 0.98 }}
            className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
              active === "danger"
                ? "text-red-400"
                : "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
            }`}
          >
            {active === "danger" && (
              <motion.div
                layoutId="activeNavPill"
                className="absolute inset-0 rounded-lg bg-red-500/15 transition-colors duration-300"
                style={{ zIndex: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <AlertTriangle size={17} className="relative z-10" />
            <span className="relative z-10">Danger zone</span>
          </motion.button>
        </div>
      </motion.div>
    </nav>
  );
}
