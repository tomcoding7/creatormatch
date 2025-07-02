-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Enable auth schema for RLS policies
create schema if not exists auth;

-- Disable RLS first
alter table creators disable row level security;

-- Create enum types
create type content_niche as enum (
  'Gaming',
  'Tech',
  'Lifestyle',
  'Education',
  'Entertainment',
  'Fashion',
  'Food',
  'Travel',
  'Fitness',
  'Music',
  'Art',
  'Business'
);

create type platform as enum (
  'YouTube',
  'TikTok',
  'Instagram',
  'Twitch',
  'Twitter'
);

create type skill_level as enum (
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
);

create type goal as enum (
  'Collaboration',
  'Friendship',
  'Learning',
  'Business'
);

create type vibe as enum (
  'Funny',
  'Educational',
  'Chill',
  'Energetic',
  'Professional',
  'Creative'
);

create type match_status as enum (
  'pending',
  'accepted',
  'rejected'
);

-- Create creators table
create table creators (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth.users(id) on delete cascade,
  name text not null,
  age integer not null check (age >= 13),
  gender text not null,
  location text,
  content_niches content_niche[] not null,
  skill_level skill_level not null,
  platforms platform[] not null,
  goals goal[] not null,
  timezone text not null,
  languages text[] not null,
  vibes vibe[] not null,
  bio text not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  onboarding_completed boolean default false,
  preferences jsonb,
  last_active timestamp with time zone,
  is_online boolean default false,
  constraint creators_auth_id_key unique (auth_id)
);

-- Enable RLS
alter table creators enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view all creators" on creators;
drop policy if exists "Users can create their own profile" on creators;
drop policy if exists "Users can update their own profile" on creators;
drop policy if exists "Users can delete their own profile" on creators;

-- Create more permissive policies for testing
create policy "Enable read access for all users"
  on creators for select
  using (true);

create policy "Enable insert access for authenticated users"
  on creators for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for users based on auth_id"
  on creators for update
  using (auth.uid() = auth_id);

create policy "Enable delete for users based on auth_id"
  on creators for delete
  using (auth.uid() = auth_id);

-- Create matches table
create table matches (
  id uuid primary key default uuid_generate_v4(),
  creator_id_1 uuid references creators(id) on delete cascade,
  creator_id_2 uuid references creators(id) on delete cascade,
  status match_status not null default 'pending',
  suggested_collabs text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint matches_unique_pair unique (creator_id_1, creator_id_2),
  constraint matches_different_creators check (creator_id_1 != creator_id_2)
);

-- Create messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade,
  sender_id uuid references creators(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create collab_suggestions table
create table collab_suggestions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  content_niches content_niche[] not null,
  platforms platform[] not null,
  difficulty skill_level not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create feedback table
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid references creators(id) on delete cascade,
  reviewed_id uuid references creators(id) on delete cascade,
  match_id uuid references matches(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  vibed_well boolean,
  good_editor boolean,
  reliable boolean,
  feedback_text text,
  created_at timestamp with time zone default now(),
  constraint feedback_unique_pair unique (reviewer_id, reviewed_id, match_id)
);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_creators_updated_at
  before update on creators
  for each row
  execute function update_updated_at_column();

create trigger update_matches_updated_at
  before update on matches
  for each row
  execute function update_updated_at_column();

create trigger update_collab_suggestions_updated_at
  before update on collab_suggestions
  for each row
  execute function update_updated_at_column();

-- Matches policies
create policy "Users can view their matches"
  on matches for select
  using (
    auth.uid() in (
      select auth_id from creators
      where id in (creator_id_1, creator_id_2)
    )
  );

create policy "Users can create matches"
  on matches for insert
  with check (
    auth.uid() in (
      select auth_id from creators
      where id = creator_id_1
    )
  );

-- Messages policies
create policy "Users can view messages in their matches"
  on messages for select
  using (
    auth.uid() in (
      select c.auth_id from creators c
      join matches m on c.id in (m.creator_id_1, m.creator_id_2)
      where m.id = match_id
    )
  );

create policy "Users can send messages in their matches"
  on messages for insert
  with check (
    auth.uid() in (
      select c.auth_id from creators c
      join matches m on c.id in (m.creator_id_1, m.creator_id_2)
      where m.id = match_id
      and m.status = 'accepted'
    )
  );

-- Collab suggestions policies
create policy "Everyone can view collab suggestions"
  on collab_suggestions for select
  using (true);

-- Feedback policies
create policy "Users can view feedback about themselves"
  on feedback for select
  using (
    auth.uid() in (
      select auth_id from creators
      where id = reviewed_id
    )
  );

create policy "Users can create feedback for their matches"
  on feedback for insert
  with check (
    auth.uid() in (
      select c.auth_id from creators c
      join matches m on c.id in (m.creator_id_1, m.creator_id_2)
      where m.id = match_id
      and m.status = 'accepted'
    )
  );

-- Function to update online status
create or replace function update_online_status()
returns trigger as $$
begin
  update creators
  set is_online = true,
      last_active = now()
  where auth_id = auth.uid();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update online status on any activity
create trigger update_creator_online_status
  after insert or update on creators
  for each row
  execute function update_online_status();

-- Function to mark users as offline after inactivity
create or replace function mark_inactive_users_offline()
returns void as $$
begin
  update creators
  set is_online = false
  where last_active < now() - interval '5 minutes';
end;
$$ language plpgsql security definer;

-- Create a cron job to run every minute (requires pg_cron extension)
select cron.schedule(
  'mark_inactive_users',
  '* * * * *',
  'select mark_inactive_users_offline()'
); 