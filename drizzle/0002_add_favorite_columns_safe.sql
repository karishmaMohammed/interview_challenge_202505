-- Add is_favorite column to users table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'is_favorite') THEN
        ALTER TABLE "users" ADD COLUMN "is_favorite" integer DEFAULT 0 NOT NULL;
    END IF;
END $$;

-- Add is_favorite column to notes table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notes' AND column_name = 'is_favorite') THEN
        ALTER TABLE "notes" ADD COLUMN "is_favorite" integer DEFAULT 0 NOT NULL;
    END IF;
END $$; 