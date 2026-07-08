-- StudyLens Connect: storage bucket for chat images
-- Objects are stored at path: {group_id}/{filename}

insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', false)
on conflict (id) do nothing;

create policy "chat_images_select_if_group_member" on storage.objects for select
  using (
    bucket_id = 'chat-images'
    and exists (
      select 1 from group_members
      where group_members.group_id::text = (storage.foldername(name))[1]
      and group_members.user_id = auth.uid()
    )
  );

create policy "chat_images_insert_if_group_member" on storage.objects for insert
  with check (
    bucket_id = 'chat-images'
    and exists (
      select 1 from group_members
      where group_members.group_id::text = (storage.foldername(name))[1]
      and group_members.user_id = auth.uid()
    )
  );
