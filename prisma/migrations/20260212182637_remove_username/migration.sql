/*
  Warnings:

  - You are about to drop the column `username1` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `username2` on the `matches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "matches" DROP COLUMN "username1",
DROP COLUMN "username2";
