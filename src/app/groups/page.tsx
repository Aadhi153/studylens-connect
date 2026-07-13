import { Users, Mail } from "lucide-react";
import { DmThread } from "@/components/dm/DmThread";

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; dm?: string }>;
}) {
  const { view, dm } = await searchParams;

  if (view === "dms") {
    if (dm) return <DmThread threadId={dm} />;

    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Mail size={24} />
          </div>
          <p className="empty-state-title">Your messages</p>
          <p className="empty-state-subtitle">
            Select a conversation from the list to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="empty-state">
        <div className="empty-state-icon">
          <Users size={24} />
        </div>
        <p className="empty-state-title">Select a group</p>
        <p className="empty-state-subtitle">
          Choose a group from the list, or create a new one to get started.
        </p>
      </div>
    </div>
  );
}
