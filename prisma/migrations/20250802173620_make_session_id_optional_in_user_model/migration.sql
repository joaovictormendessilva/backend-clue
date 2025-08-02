-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_session_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "session_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
