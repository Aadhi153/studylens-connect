"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Toggle } from "@/components/settings/Toggle";

export function TwoFactorToggle({
  onToast,
}: {
  onToast: (message: string, type: "success" | "error") => void;
}) {
  const [enabled, setEnabled] = useState(false);

  function handleChange(value: boolean) {
    setEnabled(value);
    onToast(
      value ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      "success"
    );
  }

  return (
    <Toggle
      icon={<ShieldCheck size={16} />}
      label="Two-factor authentication"
      description="Add an extra layer of security when signing in"
      checked={enabled}
      onChange={handleChange}
    />
  );
}
