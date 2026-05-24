-- STEP 1: Add column as nullable first (SAFE)
ALTER TABLE "Transaction"
ADD COLUMN "updatedAt" TIMESTAMP;

-- STEP 2: Backfill existing data
UPDATE "Transaction"
SET "updatedAt" = "createdAt";

-- STEP 3: Enforce NOT NULL constraint
ALTER TABLE "Transaction"
ALTER COLUMN "updatedAt" SET NOT NULL;

-- Optional (recommended for Postgres performance)
CREATE INDEX IF NOT EXISTS "Transaction_updatedAt_idx"
ON "Transaction" ("updatedAt");