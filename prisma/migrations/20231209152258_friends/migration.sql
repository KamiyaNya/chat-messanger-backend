-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
