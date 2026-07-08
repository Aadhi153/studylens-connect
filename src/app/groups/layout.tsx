import Link from "next/link";
import { LogoutButton } from "@/components/groups/LogoutButton";

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app-bg">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <Link href="/groups" className="text-sm font-semibold text-app-text-primary">
          StudyLens Connect
        </Link>
        <LogoutButton />
      </header>
      {children}
    </div>
  );
}
