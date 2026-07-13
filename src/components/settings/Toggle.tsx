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
        {icon && <span className="mt-0.5 text-white/50">{icon}</span>}
        <div>
          <p className="text-sm text-white">{label}</p>
          {description && <p className="text-xs text-white/50">{description}</p>}
        </div>
      </div>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.95 }}
        animate={{ backgroundColor: checked ? "#3b82f6" : "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="settings-toggle relative shrink-0"
      >
        <motion.span
          className="settings-toggle-knob"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </motion.button>
    </div>
  );
}
