/*
  Warnings:

  - Added the required column `username1` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username2` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "username1" TEXT NOT NULL,
ADD COLUMN     "username2" TEXT NOT NULL;
