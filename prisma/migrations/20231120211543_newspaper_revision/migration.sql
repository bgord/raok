-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Newspaper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "scheduledAt" INTEGER NOT NULL,
    "sentAt" INTEGER,
    "revision" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Newspaper" ("id", "scheduledAt", "sentAt", "status") SELECT "id", "scheduledAt", "sentAt", "status" FROM "Newspaper";
DROP TABLE "Newspaper";
ALTER TABLE "new_Newspaper" RENAME TO "Newspaper";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
