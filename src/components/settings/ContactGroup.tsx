"use client";

import { Lock, ChevronDown } from "lucide-react";

const TIMEZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Moscow",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export function ContactGroup({
  email,
  timezone,
  onTimezoneChange,
}: {
  email: string;
  timezone: string;
  onTimezoneChange: (value: string) => void;
}) {
  return (
    <div className="border-t border-white/[0.08] pt-5">
      <p className="settings-section-title mb-4">Contact</p>

      <div className="mb-4">
        <label htmlFor="email" className="settings-label">
          Email
        </label>
        <div className="settings-input-icon-wrap">
          <Lock size={14} className="settings-input-icon" />
          <input id="email" type="email" value={email} readOnly className="settings-input" />
        </div>
      </div>

      <div>
        <label htmlFor="timezone" className="settings-label">
          Timezone
        </label>
        <div className="relative">
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className="settings-input appearance-none pr-9"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz} className="bg-app-card">
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
          />
        </div>
      </div>
    </div>
  );
}
