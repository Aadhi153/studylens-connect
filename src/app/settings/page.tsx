import Link from "next/link";
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
    <div className="groups-page-bg min-h-screen">
      <main className="mx-auto w-full max-w-md px-6 py-10">
        <Link href="/groups" className="back-link mb-6 inline-block">
          ← Back to groups
        </Link>
        <h1 className="mb-6 text-xl font-semibold text-white">Settings</h1>
        <SettingsSections
          email={user.email ?? ""}
          displayName={(user.user_metadata?.display_name as string | undefined) ?? ""}
          avatarUrl={(user.user_metadata?.avatar_url as string | undefined) ?? null}
          isGoogleConnected={isGoogleConnected}
        />
      </main>
    </div>
  );
}
