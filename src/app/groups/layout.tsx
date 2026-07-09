import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/groups/UserMenu";

export default async function GroupsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="topbar">
        <Link href="/groups" className="text-sm font-semibold text-app-text-primary">
          StudyLens Connect
        </Link>
        <UserMenu email={user?.email ?? ""} />
      </header>
      {children}
    </div>
  );
}
