/*
  Warnings:

  - The `id` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `room_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `room_state` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "room_state" DROP CONSTRAINT "room_state_current_player_id_fkey";

-- DropForeignKey
ALTER TABLE "room_state" DROP CONSTRAINT "room_state_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_state" DROP CONSTRAINT "room_state_winnerId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_room_id_fkey";

-- DropIndex
DROP INDEX "rooms_id_key";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "room_id",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "room_state";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "session_states" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "current_player_id" TEXT NOT NULL,
    "winner_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "session_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestions" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "suspect_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "weapon_id" INTEGER NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suspects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weapons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weapons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_id_key" ON "session_states"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_current_player_id_key" ON "session_states"("current_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_winner_id_key" ON "session_states"("winner_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_states_session_id_key" ON "session_states"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "suggestions_user_id_key" ON "suggestions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "suggestions_sessionId_key" ON "suggestions"("sessionId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_suspect_id_fkey" FOREIGN KEY ("suspect_id") REFERENCES "suspects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_weapon_id_fkey" FOREIGN KEY ("weapon_id") REFERENCES "weapons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
