-- CreateTable
CREATE TABLE "registeredusers" (
    "username" VARCHAR(80) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "password" VARCHAR(80) NOT NULL
);

-- CreateTable
CREATE TABLE "PrithviUser" (
    "id" SERIAL NOT NULL,
    "user_name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),

    CONSTRAINT "PrithviUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "peices" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrithviUser_email_key" ON "PrithviUser"("email");
