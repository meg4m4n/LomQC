/*
  # Create Quality Control Tables

  1. New Tables
    - `quality_controls`
      - `id` (uuid, primary key)
      - `control_ref` (text, unique, auto-generated)
      - `date` (date)
      - `model_ref` (text)
      - `brand` (text)
      - `description` (text)
      - `state` (text)
      - `color` (text)
      - `size` (text)
      - `product_type_id` (uuid, foreign key)
      - `controller_id` (uuid, foreign key)
      - `observations` (text)
      - `result` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `measurements`
      - `id` (uuid, primary key)
      - `quality_control_id` (uuid, foreign key)
      - `description` (text)
      - `expected_value` (numeric)
      - `actual_value` (numeric)
      - `tolerance` (numeric)
      - `unit` (text)
      - `size` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `photos`
      - `id` (uuid, primary key)
      - `quality_control_id` (uuid, foreign key)
      - `url` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `photo_markings`
      - `id` (uuid, primary key)
      - `photo_id` (uuid, foreign key)
      - `x` (numeric)
      - `y` (numeric)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Functions
    - `generate_control_ref()`: Generates a unique control reference number

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quality_controls table
CREATE TABLE IF NOT EXISTS quality_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_ref text UNIQUE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  model_ref text NOT NULL,
  brand text NOT NULL,
  description text,
  state text NOT NULL CHECK (state IN ('proto1', 'proto2', 'proto3', 'proto4', 'sms', 'size-set', 'pre-production', 'production')),
  color text,
  size text,
  product_type_id uuid REFERENCES product_types(id),
  controller_id uuid REFERENCES controllers(id),
  observations text,
  result text CHECK (result IN ('OK', 'NOK', NULL)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quality_control_id uuid REFERENCES quality_controls(id) ON DELETE CASCADE,
  description text NOT NULL,
  expected_value numeric NOT NULL,
  actual_value numeric,
  tolerance numeric NOT NULL,
  unit text NOT NULL DEFAULT 'cm',
  size text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quality_control_id uuid REFERENCES quality_controls(id) ON DELETE CASCADE,
  url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photo_markings table
CREATE TABLE IF NOT EXISTS photo_markings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid REFERENCES photos(id) ON DELETE CASCADE,
  x numeric NOT NULL,
  y numeric NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to generate control reference
CREATE OR REPLACE FUNCTION generate_control_ref()
RETURNS text AS $$
DECLARE
  year text;
  sequence int;
  new_ref text;
BEGIN
  year := to_char(CURRENT_DATE, 'YYYY');
  
  -- Get the latest sequence number for the current year
  SELECT COALESCE(MAX(NULLIF(regexp_replace(control_ref, '^QC-' || year || '-', ''), '')), '0')::int
  INTO sequence
  FROM quality_controls
  WHERE control_ref LIKE 'QC-' || year || '-%';
  
  -- Increment sequence and format
  sequence := sequence + 1;
  new_ref := 'QC-' || year || '-' || LPAD(sequence::text, 4, '0');
  
  RETURN new_ref;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for control_ref generation
CREATE OR REPLACE FUNCTION set_control_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.control_ref IS NULL THEN
    NEW.control_ref := generate_control_ref();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_control_ref_trigger
  BEFORE INSERT ON quality_controls
  FOR EACH ROW
  EXECUTE FUNCTION set_control_ref();

-- Create trigger for updated_at
CREATE TRIGGER update_quality_controls_updated_at
  BEFORE UPDATE ON quality_controls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_measurements_updated_at
  BEFORE UPDATE ON measurements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_photo_markings_updated_at
  BEFORE UPDATE ON photo_markings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE quality_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_markings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON quality_controls
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON quality_controls
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON quality_controls
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON quality_controls
  FOR DELETE USING (auth.role() = 'authenticated');

-- Measurements policies
CREATE POLICY "Enable read access for authenticated users" ON measurements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON measurements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON measurements
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON measurements
  FOR DELETE USING (auth.role() = 'authenticated');

-- Photos policies
CREATE POLICY "Enable read access for authenticated users" ON photos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON photos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON photos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Photo markings policies
CREATE POLICY "Enable read access for authenticated users" ON photo_markings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON photo_markings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON photo_markings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON photo_markings
  FOR DELETE USING (auth.role() = 'authenticated');