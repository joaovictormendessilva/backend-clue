/*
  Warnings:

  - The `id` column on the `sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sessionId` on the `users` table. All the data in the column will be lost.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suspects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weapons` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `true_room_id` to the `session_states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `true_suspect_id` to the `session_states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `true_weapon_id` to the `session_states` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `current_player_id` on the `session_states` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `winner_id` on the `session_states` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `session_id` on the `session_states` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `suggestions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sessionId` on the `suggestions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `session_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogEventType" AS ENUM ('Suggestion', 'ShowCard', 'NoCard', 'Win');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Suspect', 'Room', 'Weapon');

-- DropForeignKey
ALTER TABLE "session_states" DROP CONSTRAINT "session_states_current_player_id_fkey";

-- DropForeignKey
ALTER TABLE "session_states" DROP CONSTRAINT "session_states_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_states" DROP CONSTRAINT "session_states_winner_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_room_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_suspect_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_weapon_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_sessionId_fkey";

-- DropIndex
DROP INDEX "suggestions_sessionId_key";

-- DropIndex
DROP INDEX "suggestions_user_id_key";

-- AlterTable
ALTER TABLE "session_states" ADD COLUMN     "true_room_id" INTEGER NOT NULL,
ADD COLUMN     "true_suspect_id" INTEGER NOT NULL,
ADD COLUMN     "true_weapon_id" INTEGER NOT NULL,
DROP COLUMN "current_player_id",
ADD COLUMN     "current_player_id" INTEGER NOT NULL,
DROP COLUMN "winner_id",
ADD COLUMN     "winner_id" INTEGER NOT NULL,
DROP COLUMN "session_id",
ADD COLUMN     "session_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "suggestions" DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "sessionId",
ADD COLUMN     "session_id" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- DropTable
DROP TABLE "rooms";

-- DropTable
DROP TABLE "suspects";

-- DropTable
DROP TABLE "weapons";

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CardType" NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogEvent" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_user_id" INTEGER,
    "type" "LogEventType" NOT NULL,
    "data" JSONB NOT NULL,
    "suggestion_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevealedCard" (
    "id" SERIAL NOT NULL,
    "log_event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_revealing_user_id" INTEGER NOT NULL,
    "card_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FinalAccusation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "suspect_accused_id" INTEGER NOT NULL,
    "room_accused_id" INTEGER NOT NULL,
    "weapon_accused_id" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalAccusation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevealedCard_id_key" ON "RevealedCard"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_current_player_id_key" ON "session_states"("current_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_winner_id_key" ON "session_states"("winner_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_session_id_key" ON "session_states"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_suspect_id_fkey" FOREIGN KEY ("true_suspect_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_room_id_fkey" FOREIGN KEY ("true_room_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_weapon_id_fkey" FOREIGN KEY ("true_weapon_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_suspect_id_fkey" FOREIGN KEY ("suspect_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_weapon_id_fkey" FOREIGN KEY ("weapon_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "suggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealedCard" ADD CONSTRAINT "RevealedCard_log_event_id_fkey" FOREIGN KEY ("log_event_id") REFERENCES "LogEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealedCard" ADD CONSTRAINT "RevealedCard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealedCard" ADD CONSTRAINT "RevealedCard_target_revealing_user_id_fkey" FOREIGN KEY ("target_revealing_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealedCard" ADD CONSTRAINT "RevealedCard_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalAccusation" ADD CONSTRAINT "FinalAccusation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalAccusation" ADD CONSTRAINT "FinalAccusation_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalAccusation" ADD CONSTRAINT "FinalAccusation_suspect_accused_id_fkey" FOREIGN KEY ("suspect_accused_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalAccusation" ADD CONSTRAINT "FinalAccusation_room_accused_id_fkey" FOREIGN KEY ("room_accused_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalAccusation" ADD CONSTRAINT "FinalAccusation_weapon_accused_id_fkey" FOREIGN KEY ("weapon_accused_id") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
