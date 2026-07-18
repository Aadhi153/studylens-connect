"use client";

import { motion } from "framer-motion";

export function Toggle({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="settings-toggle-row">
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 text-settings-text-secondary">{icon}</span>}
        <div>
          <p className="text-sm text-settings-text-primary">{label}</p>
          {description && <p className="text-xs text-settings-text-secondary">{description}</p>}
        </div>
      </div>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
        className={`settings-toggle relative shrink-0 ${checked ? "is-on" : ""}`}
      >
        <motion.span
          className="settings-toggle-knob"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      </motion.button>
    </div>
  );
}
