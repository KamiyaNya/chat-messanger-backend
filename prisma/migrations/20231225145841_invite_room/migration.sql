/*
  Warnings:

  - Added the required column `toUserId` to the `InviteToRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invitetoroom` DROP FOREIGN KEY `InviteToRoom_fromUserId_fkey`;

-- AlterTable
ALTER TABLE `invitetoroom` ADD COLUMN `toUserId` INTEGER NOT NULL;
