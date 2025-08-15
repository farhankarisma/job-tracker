-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'FREELANCE');

-- AlterTable
ALTER TABLE "public"."jobs" ADD COLUMN     "color" TEXT DEFAULT '#FFFFFF',
ADD COLUMN     "reminder_at" TIMESTAMP(3),
ADD COLUMN     "type" "public"."JobType" NOT NULL DEFAULT 'INTERNSHIP';
