-- ═══════════════════════════════════════════════
--  HabitFlow — Supabase SQL Setup
--  Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- 1. USERS TABLE
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  password_hash text not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- 2. HABITS TABLE
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  time text,  -- e.g. "07:00" — stored as text for simplicity
  created_at timestamptz default now()
);

-- 3. HABIT LOGS TABLE (one row per habit per day)
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  log_date date not null default current_date,
  done boolean not null default false,
  created_at timestamptz default now(),
  unique(habit_id, log_date)  -- one log per habit per day
);

-- 4. INDEXES for performance
create index if not exists idx_habits_user_id on habits(user_id);
create index if not exists idx_habit_logs_habit_id on habit_logs(habit_id);
create index if not exists idx_habit_logs_date on habit_logs(log_date);
create index if not exists idx_habit_logs_user_id on habit_logs(user_id);

-- ═══════════════════════════════════════════════
--  5. AUTO DAILY RESET using pg_cron
--  Runs at midnight (00:00) every day
--  Resets all habit_logs.done = false for the new day
--  (actually we just let new days have no log row —
--   the app treats missing log = not done)
--
--  Enable pg_cron first:
--  Supabase Dashboard → Extensions → search "pg_cron" → Enable
-- ═══════════════════════════════════════════════

-- This cron job deletes old "done=false" ghost rows to keep the table clean
-- The real reset happens naturally: each new day has no log row yet = undone
select cron.schedule(
  'habitflow-daily-reset',
  '30 18 * * *',  -- every day at 18:30 UTC (midnight IST)
  $$
    delete from habit_logs
    where log_date < current_date;
  $$
);

-- ═══════════════════════════════════════════════
--  6. ROW LEVEL SECURITY (optional but recommended)
--  Since the backend uses the service role key, RLS
--  won't block API calls. But it's good practice.
-- ═══════════════════════════════════════════════

alter table users enable row level security;
alter table habits enable row level security;
alter table habit_logs enable row level security;


-- ═══════════════════════════════════════════════
--  7. SET ADMIN USER
--  Replace with your actual email address
-- ═══════════════════════════════════════════════

-- First, add the is_admin column if it doesn't exist
alter table users add column if not exists is_admin boolean default false;

-- Set your email as admin (REPLACE WITH YOUR EMAIL)
update users set is_admin = true where email = 'eddardthehouesofstatk@gmail.com';
