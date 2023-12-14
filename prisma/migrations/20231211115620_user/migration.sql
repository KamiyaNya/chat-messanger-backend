-- DropIndex
DROP INDEX `Friends_friendId_fkey` ON `friends`;

-- AlterTable
ALTER TABLE `user` MODIFY `userOnline` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `userLastOnline` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
