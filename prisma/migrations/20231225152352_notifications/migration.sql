/*
  Warnings:

  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `notificationId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_userId_fkey`;

-- DropIndex
DROP INDEX `InviteToRoom_fromUserId_fkey` ON `invitetoroom`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `userId`,
    ADD COLUMN `notificationId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `InviteToRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
