-- CreateEnum
CREATE TYPE "LogEventType" AS ENUM ('Suggestion', 'ShowCard', 'NoCard', 'Win');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Suspect', 'Room', 'Weapon');

-- CreateEnum
CREATE TYPE "SessionStateStatusType" AS ENUM ('Waiting', 'Active', 'Finished', 'Cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "session_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "session_states" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "SessionStateStatusType" NOT NULL DEFAULT 'Waiting',
    "current_player_id" INTEGER,
    "winner_id" INTEGER,
    "session_id" INTEGER NOT NULL,
    "true_suspect_id" INTEGER,
    "true_room_id" INTEGER,
    "true_weapon_id" INTEGER,

    CONSTRAINT "session_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_state_id" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "suspect_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "weapon_id" INTEGER NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

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
CREATE UNIQUE INDEX "Player_user_id_session_state_id_key" ON "Player"("user_id", "session_state_id");

-- CreateIndex
CREATE UNIQUE INDEX "revealed_cards_id_key" ON "revealed_cards"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_suspect_id_fkey" FOREIGN KEY ("true_suspect_id") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_room_id_fkey" FOREIGN KEY ("true_room_id") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_states" ADD CONSTRAINT "session_states_true_weapon_id_fkey" FOREIGN KEY ("true_weapon_id") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_session_state_id_fkey" FOREIGN KEY ("session_state_id") REFERENCES "session_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
