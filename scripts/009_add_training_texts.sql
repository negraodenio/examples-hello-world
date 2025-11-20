-- Add 3 training text fields to journalist_styles table
ALTER TABLE journalist_styles 
ADD COLUMN IF NOT EXISTS training_text_1 TEXT,
ADD COLUMN IF NOT EXISTS training_text_2 TEXT,
ADD COLUMN IF NOT EXISTS training_text_3 TEXT;

-- Migrate existing example_text to training_text_1
UPDATE journalist_styles 
SET training_text_1 = example_text 
WHERE example_text IS NOT NULL AND training_text_1 IS NULL;

-- Add comment
COMMENT ON COLUMN journalist_styles.training_text_1 IS 'First example text for training AI on journalist writing style';
COMMENT ON COLUMN journalist_styles.training_text_2 IS 'Second example text for training AI on journalist writing style';
COMMENT ON COLUMN journalist_styles.training_text_3 IS 'Third example text for training AI on journalist writing style';
