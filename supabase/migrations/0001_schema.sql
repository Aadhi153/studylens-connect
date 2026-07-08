-- StudyLens Connect: core schema

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups on delete cascade not null,
  user_id uuid references auth.users not null,
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups on delete cascade not null,
  sender_id uuid references auth.users not null,
  content text,
  image_url text,
  pinned_note_id uuid,
  created_at timestamptz default now()
);

create table if not exists message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages on delete cascade not null,
  user_id uuid references auth.users not null,
  read_at timestamptz default now(),
  unique(message_id, user_id)
);

create index if not exists idx_group_members_group_id on group_members(group_id);
create index if not exists idx_group_members_user_id on group_members(user_id);
create index if not exists idx_messages_group_id on messages(group_id, created_at);
create index if not exists idx_message_reads_message_id on message_reads(message_id);

-- Enable realtime for the tables the client subscribes to
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table message_reads;
