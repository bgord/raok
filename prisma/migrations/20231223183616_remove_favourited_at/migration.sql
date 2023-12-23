/*
  Warnings:

  - You are about to drop the column `favouritedAt` on the `Article` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "title" TEXT DEFAULT '-',
    "newspaperId" TEXT,
    "estimatedReadingTimeInMinutes" INTEGER,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL,
    CONSTRAINT "Article_newspaperId_fkey" FOREIGN KEY ("newspaperId") REFERENCES "Newspaper" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("createdAt", "estimatedReadingTimeInMinutes", "id", "newspaperId", "rating", "revision", "source", "status", "title", "url") SELECT "createdAt", "estimatedReadingTimeInMinutes", "id", "newspaperId", "rating", "revision", "source", "status", "title", "url" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE INDEX "Article_status_idx" ON "Article"("status");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
