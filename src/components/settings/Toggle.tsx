"use client";

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
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`settings-toggle shrink-0 ${checked ? "is-on" : ""}`}
      >
        <span className="settings-toggle-knob" />
      </button>
    </div>
  );
}
