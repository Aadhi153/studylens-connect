export function SettingsFooter() {
  return (
    <div className="flex shrink-0 items-center justify-center gap-3 px-4 py-4 text-xs text-settings-text-tertiary">
      <span>StudyLens Connect · v1.0.0</span>
      <span aria-hidden="true">·</span>
      <a href="mailto:support@studylensconnect.app" className="transition hover:text-settings-text-secondary">
        Support
      </a>
    </div>
  );
}
