-- HydroLog Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_goal_ml INTEGER DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drink logs table
CREATE TABLE IF NOT EXISTS drink_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  drink_type TEXT NOT NULL CHECK (drink_type IN ('water', 'coffee', 'soda', 'alcohol', 'other')),
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0 AND amount_ml <= 5000),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_drink_logs_user_date ON drink_logs(user_id, logged_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Drink logs policies
CREATE POLICY "Users can view own logs" ON drink_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON drink_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own logs" ON drink_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bathroom logs table
CREATE TABLE IF NOT EXISTS bathroom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bathroom_type TEXT NOT NULL CHECK (bathroom_type IN ('pee', 'poop')),
  note TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_bathroom_logs_user_date ON bathroom_logs(user_id, logged_at);

-- Enable Row Level Security
ALTER TABLE bathroom_logs ENABLE ROW LEVEL SECURITY;

-- Bathroom logs policies
CREATE POLICY "Users can view own bathroom logs" ON bathroom_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bathroom logs" ON bathroom_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bathroom logs" ON bathroom_logs
  FOR DELETE USING (auth.uid() = user_id);
