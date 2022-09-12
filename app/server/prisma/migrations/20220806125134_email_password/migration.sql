/*
  Warnings:

  - You are about to drop the column `user_name` on the `PrithviUser` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `registeredusers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrithviUser" DROP COLUMN "user_name";

-- AlterTable
ALTER TABLE "registeredusers" DROP COLUMN "username";
