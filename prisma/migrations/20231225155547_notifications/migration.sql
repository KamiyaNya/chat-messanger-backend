/*
  Warnings:

  - You are about to drop the column `accept` on the `invitetoroom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitetoroom` DROP COLUMN `accept`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `accept` BOOLEAN NOT NULL DEFAULT false;
