/*
  # Create initial tables

  1. New Tables
    - `product_types`
      - `id` (uuid, primary key)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `controllers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create product_types table
CREATE TABLE IF NOT EXISTS product_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create controllers table
CREATE TABLE IF NOT EXISTS controllers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE controllers ENABLE ROW LEVEL SECURITY;

-- Create policies for product_types
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'product_types'::regclass 
    AND polname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users" ON product_types
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'product_types'::regclass 
    AND polname = 'Enable insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users" ON product_types
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'product_types'::regclass 
    AND polname = 'Enable update for authenticated users'
  ) THEN
    CREATE POLICY "Enable update for authenticated users" ON product_types
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'product_types'::regclass 
    AND polname = 'Enable delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable delete for authenticated users" ON product_types
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create policies for controllers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'controllers'::regclass 
    AND polname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users" ON controllers
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'controllers'::regclass 
    AND polname = 'Enable insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users" ON controllers
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'controllers'::regclass 
    AND polname = 'Enable update for authenticated users'
  ) THEN
    CREATE POLICY "Enable update for authenticated users" ON controllers
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'controllers'::regclass 
    AND polname = 'Enable delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable delete for authenticated users" ON controllers
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_product_types_updated_at ON product_types;
CREATE TRIGGER update_product_types_updated_at
  BEFORE UPDATE ON product_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_controllers_updated_at ON controllers;
CREATE TRIGGER update_controllers_updated_at
  BEFORE UPDATE ON controllers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();