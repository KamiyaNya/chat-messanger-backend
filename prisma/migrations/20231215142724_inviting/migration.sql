/*
  Warnings:

  - You are about to drop the column `friendId` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the `friends` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `rooms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `personalmessages` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'text',
    MODIFY `message` TEXT NULL;

-- AlterTable
ALTER TABLE `rooms` DROP COLUMN `friendId`,
    MODIFY `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `friends`;

-- CreateTable
CREATE TABLE `InviteToRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `fromUserId` INTEGER NOT NULL,
    `accept` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rooms` ADD CONSTRAINT `Rooms_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteToRoom` ADD CONSTRAINT `InviteToRoom_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
