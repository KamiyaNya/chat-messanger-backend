/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `personalmessages` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `personalmessages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `personalmessages` DROP FOREIGN KEY `PersonalMessages_fromUserId_fkey`;

-- DropIndex
DROP INDEX `Rooms_userId_fkey` ON `rooms`;

-- AlterTable
ALTER TABLE `personalmessages` DROP COLUMN `fromUserId`,
    DROP COLUMN `toUserId`,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
