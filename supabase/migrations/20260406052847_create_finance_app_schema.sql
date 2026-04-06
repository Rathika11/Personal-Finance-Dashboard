/*
  # Personal Finance App Schema

  ## Overview
  Complete database schema for a personal finance management app targeting young professionals.
  
  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `monthly_income` (numeric) - User's monthly income for budgeting
  - `currency` (text, default 'USD')
  - `onboarded` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `categories`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `name` (text) - Category name (e.g., Food, Transport, Entertainment)
  - `icon` (text) - Icon identifier
  - `color` (text) - Color hex code
  - `type` (text) - 'expense' or 'income'
  - `is_default` (boolean) - System default categories
  - `created_at` (timestamptz)
  
  ### 3. `transactions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `category_id` (uuid, references categories)
  - `amount` (numeric)
  - `type` (text) - 'expense' or 'income'
  - `description` (text)
  - `date` (date)
  - `created_at` (timestamptz)
  
  ### 4. `goals`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text) - Goal name
  - `target_amount` (numeric)
  - `current_amount` (numeric, default 0)
  - `deadline` (date)
  - `icon` (text)
  - `color` (text)
  - `status` (text, default 'active') - 'active', 'completed', 'cancelled'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Policies for SELECT, INSERT, UPDATE, DELETE operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  monthly_income numeric DEFAULT 0,
  currency text DEFAULT 'USD',
  onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text DEFAULT 'circle',
  color text DEFAULT '#3B82F6',
  type text NOT NULL CHECK (type IN ('expense', 'income')),
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  type text NOT NULL CHECK (type IN ('expense', 'income')),
  description text DEFAULT '',
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target_amount numeric NOT NULL CHECK (target_amount > 0),
  current_amount numeric DEFAULT 0 CHECK (current_amount >= 0),
  deadline date,
  icon text DEFAULT 'target',
  color text DEFAULT '#10B981',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Insert default categories
INSERT INTO categories (name, icon, color, type, is_default) VALUES
  ('Food & Dining', 'utensils', '#EF4444', 'expense', true),
  ('Transportation', 'car', '#F59E0B', 'expense', true),
  ('Shopping', 'shopping-bag', '#EC4899', 'expense', true),
  ('Entertainment', 'film', '#8B5CF6', 'expense', true),
  ('Bills & Utilities', 'receipt', '#6366F1', 'expense', true),
  ('Healthcare', 'heart', '#14B8A6', 'expense', true),
  ('Education', 'book', '#3B82F6', 'expense', true),
  ('Other', 'more-horizontal', '#6B7280', 'expense', true),
  ('Salary', 'briefcase', '#10B981', 'income', true),
  ('Freelance', 'laptop', '#059669', 'income', true),
  ('Investment', 'trending-up', '#0891B2', 'income', true),
  ('Other Income', 'plus-circle', '#06B6D4', 'income', true)
ON CONFLICT DO NOTHING;