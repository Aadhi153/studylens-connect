"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, ChevronDown, Type, LayoutList } from "lucide-react";
import type { Theme } from "@/components/settings/SettingsSections";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
];

type FontSize = "small" | "medium" | "large";
type ChatDensity = "compact" | "comfortable";

const FONT_SIZES: { value: FontSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const DENSITIES: { value: ChatDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
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
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [density, setDensity] = useState<ChatDensity>("comfortable");

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

      <div className="mb-6">
        <label className="settings-label">
          <span className="inline-flex items-center gap-1.5">
            <Type size={12} />
            Font size
          </span>
        </label>
        <div role="radiogroup" aria-label="Font size" className="settings-segmented">
          {FONT_SIZES.map(({ value, label }) => (
            <motion.button
              key={value}
              type="button"
              role="radio"
              aria-checked={fontSize === value}
              onClick={() => setFontSize(value)}
              whileTap={{ scale: 0.98 }}
              className={`settings-segmented-option ${fontSize === value ? "is-active" : ""}`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="settings-label">
          <span className="inline-flex items-center gap-1.5">
            <LayoutList size={12} />
            Chat density
          </span>
        </label>
        <div role="radiogroup" aria-label="Chat density" className="settings-segmented">
          {DENSITIES.map(({ value, label }) => (
            <motion.button
              key={value}
              type="button"
              role="radio"
              aria-checked={density === value}
              onClick={() => setDensity(value)}
              whileTap={{ scale: 0.98 }}
              className={`settings-segmented-option ${density === value ? "is-active" : ""}`}
            >
              {label}
            </motion.button>
          ))}
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
