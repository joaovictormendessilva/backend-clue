/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalAccusation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevealedCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FinalAccusation" DROP CONSTRAINT "FinalAccusation_room_accused_id_fkey";

-- DropForeignKey
ALTER TABLE "FinalAccusation" DROP CONSTRAINT "FinalAccusation_session_id_fkey";

-- DropForeignKey
ALTER TABLE "FinalAccusation" DROP CONSTRAINT "FinalAccusation_suspect_accused_id_fkey";

-- DropForeignKey
ALTER TABLE "FinalAccusation" DROP CONSTRAINT "FinalAccusation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FinalAccusation" DROP CONSTRAINT "FinalAccusation_weapon_accused_id_fkey";

-- DropForeignKey
ALTER TABLE "LogEvent" DROP CONSTRAINT "LogEvent_session_id_fkey";

-- DropForeignKey
ALTER TABLE "LogEvent" DROP CONSTRAINT "LogEvent_suggestion_id_fkey";

-- DropForeignKey
ALTER TABLE "LogEvent" DROP CONSTRAINT "LogEvent_target_user_id_fkey";

-- DropForeignKey
ALTER TABLE "LogEvent" DROP CONSTRAINT "LogEvent_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RevealedCard" DROP CONSTRAINT "RevealedCard_card_id_fkey";

-- DropForeignKey
ALTER TABLE "RevealedCard" DROP CONSTRAINT "RevealedCard_log_event_id_fkey";

-- DropForeignKey
ALTER TABLE "RevealedCard" DROP CONSTRAINT "RevealedCard_target_revealing_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RevealedCard" DROP CONSTRAINT "RevealedCard_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session_states" DROP CONSTRAINT "session_states_true_room_id_fkey";

-- DropForeignKey
ALTER TABLE "session_states" DROP CONSTRAINT "session_states_true_suspect_id_fkey";

-- DropForeignKey
ALTER TABLE "session_states" DROP CONSTRAINT "session_states_true_weapon_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_room_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_suspect_id_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_weapon_id_fkey";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "FinalAccusation";

-- DropTable
DROP TABLE "LogEvent";

-- DropTable
DROP TABLE "RevealedCard";

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CardType" NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_events" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_user_id" INTEGER,
    "type" "LogEventType" NOT NULL,
    "data" JSONB NOT NULL,
    "suggestion_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revealed_cards" (
    "id" SERIAL NOT NULL,
    "log_event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_revealing_user_id" INTEGER NOT NULL,
    "card_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "final_accusations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "suspect_accused_id" INTEGER NOT NULL,
    "room_accused_id" INTEGER NOT NULL,
    "weapon_accused_id" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "final_accusations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "revealed_cards_id_key" ON "revealed_cards"("id");

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_suspect_id_fkey" FOREIGN KEY ("true_suspect_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_room_id_fkey" FOREIGN KEY ("true_room_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_weapon_id_fkey" FOREIGN KEY ("true_weapon_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_suspect_id_fkey" FOREIGN KEY ("suspect_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_weapon_id_fkey" FOREIGN KEY ("weapon_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_events" ADD CONSTRAINT "log_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_events" ADD CONSTRAINT "log_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_events" ADD CONSTRAINT "log_events_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_events" ADD CONSTRAINT "log_events_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "suggestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revealed_cards" ADD CONSTRAINT "revealed_cards_log_event_id_fkey" FOREIGN KEY ("log_event_id") REFERENCES "log_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revealed_cards" ADD CONSTRAINT "revealed_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revealed_cards" ADD CONSTRAINT "revealed_cards_target_revealing_user_id_fkey" FOREIGN KEY ("target_revealing_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revealed_cards" ADD CONSTRAINT "revealed_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_accusations" ADD CONSTRAINT "final_accusations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_accusations" ADD CONSTRAINT "final_accusations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_accusations" ADD CONSTRAINT "final_accusations_suspect_accused_id_fkey" FOREIGN KEY ("suspect_accused_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_accusations" ADD CONSTRAINT "final_accusations_room_accused_id_fkey" FOREIGN KEY ("room_accused_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_accusations" ADD CONSTRAINT "final_accusations_weapon_accused_id_fkey" FOREIGN KEY ("weapon_accused_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
