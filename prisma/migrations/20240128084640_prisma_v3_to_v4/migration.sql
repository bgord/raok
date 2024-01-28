/*
  Warnings:

  - You are about to alter the column `createdAt` on the `RssCrawlerJob` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `updatedAt` on the `RssCrawlerJob` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `createdAt` on the `TokenBlacklist` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `scheduledAt` on the `Newspaper` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `sentAt` on the `Newspaper` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `createdAt` on the `Source` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `updatedAt` on the `Source` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `createdAt` on the `TokenRating` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `dismissedUntil` on the `TokenRating` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `updatedAt` on the `TokenRating` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `createdAt` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `sentAt` on the `Files` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RssCrawlerJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_RssCrawlerJob" ("createdAt", "id", "revision", "sourceId", "status", "updatedAt", "url") SELECT "createdAt", "id", "revision", "sourceId", "status", "updatedAt", "url" FROM "RssCrawlerJob";
DROP TABLE "RssCrawlerJob";
ALTER TABLE "new_RssCrawlerJob" RENAME TO "RssCrawlerJob";
CREATE TABLE "new_TokenBlacklist" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "createdAt" BIGINT NOT NULL
);
INSERT INTO "new_TokenBlacklist" ("createdAt", "token") SELECT "createdAt", "token" FROM "TokenBlacklist";
DROP TABLE "TokenBlacklist";
ALTER TABLE "new_TokenBlacklist" RENAME TO "TokenBlacklist";
CREATE TABLE "new_Newspaper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "scheduledAt" BIGINT NOT NULL,
    "sentAt" BIGINT,
    "revision" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Newspaper" ("id", "revision", "scheduledAt", "sentAt", "status") SELECT "id", "revision", "scheduledAt", "sentAt", "status" FROM "Newspaper";
DROP TABLE "Newspaper";
ALTER TABLE "new_Newspaper" RENAME TO "Newspaper";
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL DEFAULT 0,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "countValue" INTEGER NOT NULL DEFAULT 0,
    "countStrategy" TEXT NOT NULL DEFAULT 'total_last_month'
);
INSERT INTO "new_Source" ("countStrategy", "countValue", "createdAt", "id", "revision", "status", "updatedAt", "url") SELECT "countStrategy", "countValue", "createdAt", "id", "revision", "status", "updatedAt", "url" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE TABLE "new_TokenRating" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL DEFAULT 0,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL DEFAULT 0,
    "dismissedUntil" BIGINT
);
INSERT INTO "new_TokenRating" ("createdAt", "dismissedUntil", "token", "updatedAt", "value") SELECT "createdAt", "dismissedUntil", "token", "updatedAt", "value" FROM "TokenRating";
DROP TABLE "TokenRating";
ALTER TABLE "new_TokenRating" RENAME TO "TokenRating";
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "title" TEXT DEFAULT '-',
    "newspaperId" TEXT,
    "estimatedReadingTimeInMinutes" INTEGER,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL,
    "description" TEXT,
    CONSTRAINT "Article_newspaperId_fkey" FOREIGN KEY ("newspaperId") REFERENCES "Newspaper" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("createdAt", "description", "estimatedReadingTimeInMinutes", "id", "newspaperId", "rating", "revision", "source", "status", "title", "url") SELECT "createdAt", "description", "estimatedReadingTimeInMinutes", "id", "newspaperId", "rating", "revision", "source", "status", "title", "url" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE INDEX "Article_status_idx" ON "Article"("status");
CREATE TABLE "new_Files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "sentAt" BIGINT
);
INSERT INTO "new_Files" ("id", "name", "path", "sentAt", "size") SELECT "id", "name", "path", "sentAt", "size" FROM "Files";
DROP TABLE "Files";
ALTER TABLE "new_Files" RENAME TO "Files";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
