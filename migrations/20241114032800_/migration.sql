/*
  Warnings:

  - You are about to alter the column `passwordHash` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Char(72)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET DATA TYPE CHAR(72);
