-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL DEFAULT 0,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "countValue" INTEGER NOT NULL DEFAULT 0,
    "countStrategy" TEXT NOT NULL DEFAULT 'total_last_month'
);
INSERT INTO "new_Source" ("createdAt", "id", "revision", "status", "updatedAt", "url") SELECT "createdAt", "id", "revision", "status", "updatedAt", "url" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
