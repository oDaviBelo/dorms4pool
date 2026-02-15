/*
  Warnings:

  - You are about to drop the column `iinnerIdBy1` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `loserIdBy2` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `winnerIdBy2` on the `matches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `morador` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" DROP COLUMN "iinnerIdBy1",
DROP COLUMN "loserIdBy2",
DROP COLUMN "winnerIdBy2",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "data" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "morador" BOOLEAN NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
