import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsSections } from "@/components/settings/SettingsSections";

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
    <div className="settings-page-bg flex h-screen flex-col">
      <div className="shrink-0 px-4 py-3 md:px-6">
        <Link href="/groups" className="back-link inline-block">
          ← Back to groups
        </Link>
      </div>

      <Suspense>
        <SettingsSections
          email={user.email ?? ""}
          displayName={(user.user_metadata?.display_name as string | undefined) ?? ""}
          avatarUrl={(user.user_metadata?.avatar_url as string | undefined) ?? null}
          isGoogleConnected={isGoogleConnected}
        />
      </Suspense>
    </div>
  );
}
