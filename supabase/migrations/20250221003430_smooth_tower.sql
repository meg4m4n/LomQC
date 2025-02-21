/*
  # Update foreign key constraints for product types

  1. Changes
    - Add ON DELETE CASCADE to quality_controls.product_type_id foreign key
    - This allows deleting product types that are referenced by quality controls
*/

-- Drop the existing foreign key constraint
ALTER TABLE quality_controls
DROP CONSTRAINT IF EXISTS quality_controls_product_type_id_fkey;

-- Add the new constraint with ON DELETE CASCADE
ALTER TABLE quality_controls
ADD CONSTRAINT quality_controls_product_type_id_fkey
FOREIGN KEY (product_type_id)
REFERENCES product_types(id)
ON DELETE CASCADE;