-- Run in project prdemfcyvsqjozfrkteo. Create invited users in Supabase Auth,
-- then grant access with: insert into public.admin_members(user_id, role)
-- values ('<auth.users id>', 'admin');
create table if not exists public.admin_members (
    user_id uuid primary key references auth.users(id) on delete cascade,
    role text not null check (role = 'admin'),
    created_at timestamptz not null default now()
);

alter table public.admin_members enable row level security;

drop policy if exists "Admins can read own membership" on public.admin_members;
create policy "Admins can read own membership"
on public.admin_members for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.admin_members from anon;
grant select on public.admin_members to authenticated;
