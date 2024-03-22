/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "Profile" (
    "profileID" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileID")
);

-- CreateTable
CREATE TABLE "Cart" (
    "cartID" SERIAL NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartID")
);

-- CreateTable
CREATE TABLE "KategoriList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,

    CONSTRAINT "KategoriList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "storeLocation" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "itemCategory" TEXT NOT NULL,

    CONSTRAINT "ItemList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemDetail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "storeLocation" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "itemCategory" TEXT NOT NULL,
    "cartID" INTEGER,

    CONSTRAINT "ItemDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemComment" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "ItemComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KategoriList_id_key" ON "KategoriList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriList_name_key" ON "KategoriList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemList_id_key" ON "ItemList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ItemDetail_id_key" ON "ItemDetail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ItemComment_id_key" ON "ItemComment"("id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_cartID_fkey" FOREIGN KEY ("cartID") REFERENCES "Profile"("profileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemList" ADD CONSTRAINT "ItemList_itemCategory_fkey" FOREIGN KEY ("itemCategory") REFERENCES "KategoriList"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemDetail" ADD CONSTRAINT "ItemDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "ItemList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemDetail" ADD CONSTRAINT "ItemDetail_cartID_fkey" FOREIGN KEY ("cartID") REFERENCES "Cart"("cartID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComment" ADD CONSTRAINT "ItemComment_id_fkey" FOREIGN KEY ("id") REFERENCES "ItemDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
