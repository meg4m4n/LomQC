/*
  # Initial Schema Setup

  1. New Tables
    - `product_types`
      - `id` (uuid, primary key)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `controllers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform CRUD operations
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
CREATE POLICY "Enable read access for all users" ON product_types
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON product_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON product_types
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON product_types
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for controllers
CREATE POLICY "Enable read access for all users" ON controllers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON controllers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON controllers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON controllers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_product_types_updated_at
  BEFORE UPDATE ON product_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_controllers_updated_at
  BEFORE UPDATE ON controllers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();