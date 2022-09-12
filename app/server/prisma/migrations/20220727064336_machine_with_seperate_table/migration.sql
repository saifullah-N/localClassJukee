/*
  Warnings:

  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Record";

-- CreateTable
CREATE TABLE "Mach1" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mach1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mach2" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mach2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mach3" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mach3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mach4" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mach4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mach5" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mach5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mach6" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mach6_pkey" PRIMARY KEY ("id")
);
