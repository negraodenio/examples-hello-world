-- Add 3 training text fields to journalist_styles table
ALTER TABLE journalist_styles 
ADD COLUMN IF NOT EXISTS training_text_1 TEXT,
ADD COLUMN IF NOT EXISTS training_text_2 TEXT,
ADD COLUMN IF NOT EXISTS training_text_3 TEXT;

-- Drop the old example_text column in favor of the 3 training texts
-- (We'll keep it for backward compatibility but prefer the new columns)

-- Add comment explaining the training system
COMMENT ON COLUMN journalist_styles.training_text_1 IS 'First training example - AI analyzes this to learn writing style';
COMMENT ON COLUMN journalist_styles.training_text_2 IS 'Second training example - Reinforces style patterns';
COMMENT ON COLUMN journalist_styles.training_text_3 IS 'Third training example - Completes style profile';
