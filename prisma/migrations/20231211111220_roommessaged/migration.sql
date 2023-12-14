-- AlterTable
ALTER TABLE `personalmessages` ADD COLUMN `userId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `PersonalMessages` ADD CONSTRAINT `PersonalMessages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
