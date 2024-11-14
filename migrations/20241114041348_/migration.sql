/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(12)` to `Char(10)`.
  - You are about to alter the column `passwordHash` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(72)` to `Char(60)`.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(10),
ALTER COLUMN "passwordHash" SET DATA TYPE CHAR(60),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
