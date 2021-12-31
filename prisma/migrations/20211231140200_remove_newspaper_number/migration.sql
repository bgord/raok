/*
  Warnings:

  - The primary key for the `Newspaper` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `newspaperId` on the `Newspaper` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Newspaper` table. All the data in the column will be lost.
  - The required column `id` was added to the `Newspaper` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Newspaper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "scheduledAt" INTEGER NOT NULL
);
INSERT INTO "new_Newspaper" ("scheduledAt", "status") SELECT "scheduledAt", "status" FROM "Newspaper";
DROP TABLE "Newspaper";
ALTER TABLE "new_Newspaper" RENAME TO "Newspaper";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
