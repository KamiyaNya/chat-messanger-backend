-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `userId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
