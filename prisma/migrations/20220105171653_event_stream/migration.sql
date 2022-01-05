/*
  Warnings:

  - Added the required column `stream` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "payload" TEXT NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "id", "name", "payload", "version") SELECT "createdAt", "id", "name", "payload", "version" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
