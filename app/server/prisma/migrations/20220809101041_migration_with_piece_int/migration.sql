/*
  Warnings:

  - You are about to drop the column `peices` on the `Mach1` table. All the data in the column will be lost.
  - You are about to drop the column `peices` on the `Mach2` table. All the data in the column will be lost.
  - You are about to drop the column `peices` on the `Mach3` table. All the data in the column will be lost.
  - You are about to drop the column `peices` on the `Mach4` table. All the data in the column will be lost.
  - You are about to drop the column `peices` on the `Mach5` table. All the data in the column will be lost.
  - You are about to drop the column `peices` on the `Mach6` table. All the data in the column will be lost.
  - Added the required column `pieces` to the `Mach1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pieces` to the `Mach2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pieces` to the `Mach3` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pieces` to the `Mach4` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pieces` to the `Mach5` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pieces` to the `Mach6` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mach1" DROP COLUMN "peices",
ADD COLUMN     "pieces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mach2" DROP COLUMN "peices",
ADD COLUMN     "pieces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mach3" DROP COLUMN "peices",
ADD COLUMN     "pieces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mach4" DROP COLUMN "peices",
ADD COLUMN     "pieces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mach5" DROP COLUMN "peices",
ADD COLUMN     "pieces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Mach6" DROP COLUMN "peices",
ADD COLUMN     "pieces" INTEGER NOT NULL;
