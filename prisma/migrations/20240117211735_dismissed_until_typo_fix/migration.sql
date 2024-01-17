/*
  Warnings:

  - You are about to drop the column `dismissedUntill` on the `TokenRating` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TokenRating" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL DEFAULT 0,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL DEFAULT 0,
    "dismissedUntil" INTEGER
);
INSERT INTO "new_TokenRating" ("createdAt", "token", "updatedAt", "value") SELECT "createdAt", "token", "updatedAt", "value" FROM "TokenRating";
DROP TABLE "TokenRating";
ALTER TABLE "new_TokenRating" RENAME TO "TokenRating";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
