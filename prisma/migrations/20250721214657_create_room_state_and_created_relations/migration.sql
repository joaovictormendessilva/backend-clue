/*
  Warnings:

  - Added the required column `updated_at` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "room_state" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_player_id" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "room_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_state_id_key" ON "room_state"("id");

-- CreateIndex
CREATE UNIQUE INDEX "room_state_current_player_id_key" ON "room_state"("current_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_state_winnerId_key" ON "room_state"("winnerId");

-- CreateIndex
CREATE UNIQUE INDEX "room_state_room_id_key" ON "room_state"("room_id");

-- AddForeignKey
ALTER TABLE "room_state" ADD CONSTRAINT "room_state_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_state" ADD CONSTRAINT "room_state_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_state" ADD CONSTRAINT "room_state_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
