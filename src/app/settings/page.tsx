import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsSections } from "@/components/settings/SettingsSections";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isGoogleConnected = (user.identities ?? []).some(
    (identity) => identity.provider === "google"
  );

  return (
    <SettingsPageShell>
      <Suspense>
        <SettingsSections
          email={user.email ?? ""}
          displayName={(user.user_metadata?.display_name as string | undefined) ?? ""}
          avatarUrl={(user.user_metadata?.avatar_url as string | undefined) ?? null}
          isGoogleConnected={isGoogleConnected}
        />
      </Suspense>
    </SettingsPageShell>
  );
}
