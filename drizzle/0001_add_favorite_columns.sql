ALTER TABLE "notes" ADD COLUMN "is_favorite" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN "is_favorite" integer DEFAULT 0 NOT NULL; 