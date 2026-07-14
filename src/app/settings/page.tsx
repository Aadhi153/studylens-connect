import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsSections } from "@/components/settings/SettingsSections";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { getProfileStats } from "@/lib/profileStats";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isGoogleConnected = (user.identities ?? []).some(
    (identity) => identity.provider === "google"
  );

  const stats = await getProfileStats(supabase, user.id);

  return (
    <SettingsPageShell userEmail={user.email ?? ""}>
      <Suspense>
        <SettingsSections
          email={user.email ?? ""}
          displayName={(user.user_metadata?.display_name as string | undefined) ?? ""}
          avatarUrl={(user.user_metadata?.avatar_url as string | undefined) ?? null}
          bio={(user.user_metadata?.bio as string | undefined) ?? ""}
          timezone={(user.user_metadata?.timezone as string | undefined) ?? ""}
          memberSince={user.created_at}
          stats={stats}
          isGoogleConnected={isGoogleConnected}
        />
      </Suspense>
    </SettingsPageShell>
  );
}
