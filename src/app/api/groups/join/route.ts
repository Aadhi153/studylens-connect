import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { inviteCode } = await request.json();

  if (!inviteCode || typeof inviteCode !== "string") {
    return NextResponse.json({ error: "Invite code is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: group, error: lookupError } = await admin
    .from("groups")
    .select("id, name")
    .eq("invite_code", inviteCode.trim().toLowerCase())
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (!group) {
    return NextResponse.json({ error: "Invalid invite code." }, { status: 404 });
  }

  const { error: joinError } = await supabase
    .from("group_members")
    .upsert(
      { group_id: group.id, user_id: user.id },
      { onConflict: "group_id,user_id", ignoreDuplicates: true }
    );

  if (joinError) {
    return NextResponse.json({ error: joinError.message }, { status: 500 });
  }

  return NextResponse.json({ groupId: group.id, groupName: group.name });
}
