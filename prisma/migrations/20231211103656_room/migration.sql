-- DropForeignKey
ALTER TABLE `rooms` DROP FOREIGN KEY `Rooms_userId_fkey`;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `friendId` INTEGER NULL,
    MODIFY `userId` INTEGER NULL;
