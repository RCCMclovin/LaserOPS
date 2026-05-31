/*
  Warnings:

  - Added the required column `status` to the `StoreRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StoreRequest` ADD COLUMN `status` VARCHAR(10) NOT NULL;
