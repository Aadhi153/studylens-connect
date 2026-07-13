"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import type { Theme } from "@/components/settings/SettingsSections";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
];

export function AppearanceSection({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}) {
  return (
    <section className="settings-card">
      <h2 className="settings-section-title mb-5">Appearance</h2>

      <div className="mb-6">
        <label className="settings-label">Theme</label>
        <div role="radiogroup" aria-label="Theme" className="settings-segmented">
          <motion.button
            type="button"
            role="radio"
            aria-checked={theme === "dark"}
            onClick={() => onThemeChange("dark")}
            whileTap={{ scale: 0.98 }}
            className={`settings-segmented-option ${theme === "dark" ? "is-active" : ""}`}
          >
            <Moon size={14} />
            Dark
          </motion.button>
          <motion.button
            type="button"
            role="radio"
            aria-checked={theme === "light"}
            onClick={() => onThemeChange("light")}
            whileTap={{ scale: 0.98 }}
            className={`settings-segmented-option ${theme === "light" ? "is-active" : ""}`}
          >
            <Sun size={14} />
            Light
          </motion.button>
          <motion.button
            type="button"
            role="radio"
            aria-checked={theme === "system"}
            onClick={() => onThemeChange("system")}
            whileTap={{ scale: 0.98 }}
            className={`settings-segmented-option ${theme === "system" ? "is-active" : ""}`}
          >
            <Monitor size={14} />
            System
          </motion.button>
        </div>
      </div>

      <div>
        <label htmlFor="language" className="settings-label">
          Language
        </label>
        <div className="relative">
          <select
            id="language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="settings-input appearance-none pr-9"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-app-card">
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
          />
        </div>
      </div>
    </section>
  );
}
