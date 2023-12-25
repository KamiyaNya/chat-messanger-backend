/*
  Warnings:

  - You are about to drop the column `accept` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitetoroom` ADD COLUMN `accept` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `accept`,
    ADD COLUMN `viewed` BOOLEAN NOT NULL DEFAULT false;
