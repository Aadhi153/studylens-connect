-- StudyLens Connect: row level security

alter table groups enable row level security;
alter table group_members enable row level security;
alter table messages enable row level security;
alter table message_reads enable row level security;

-- Groups: only members can view; anyone authenticated can create
create policy "select_groups_if_member" on groups for select
  using (exists (select 1 from group_members where group_members.group_id = groups.id and group_members.user_id = auth.uid()));

create policy "insert_groups" on groups for insert
  with check (auth.uid() = created_by);

-- Group members: only members of the same group can view the member list
create policy "select_own_group_members" on group_members for select
  using (exists (select 1 from group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid()));

create policy "insert_group_members" on group_members for insert
  with check (auth.uid() = user_id);

-- Messages: only group members can read/write
create policy "select_messages_if_member" on messages for select
  using (exists (select 1 from group_members where group_members.group_id = messages.group_id and group_members.user_id = auth.uid()));

create policy "insert_messages_if_member" on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (select 1 from group_members where group_members.group_id = messages.group_id and group_members.user_id = auth.uid())
  );

-- Message reads: users can only insert their own read receipts
create policy "insert_own_read_receipt" on message_reads for insert
  with check (auth.uid() = user_id);

create policy "select_reads_if_group_member" on message_reads for select
  using (exists (
    select 1 from messages
    join group_members on group_members.group_id = messages.group_id
    where messages.id = message_reads.message_id and group_members.user_id = auth.uid()
  ));
