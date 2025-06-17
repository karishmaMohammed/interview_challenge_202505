ALTER TABLE "notes" ADD COLUMN "is_favorite" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_favorite" integer DEFAULT 0 NOT NULL;