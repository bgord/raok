-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL DEFAULT 0,
    "processedUntil" BIGINT NOT NULL DEFAULT 0,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "countValue" INTEGER NOT NULL DEFAULT 0,
    "countStrategy" TEXT NOT NULL DEFAULT 'total_last_month'
);
INSERT INTO "new_Source" ("countStrategy", "countValue", "createdAt", "id", "revision", "status", "updatedAt", "url") SELECT "countStrategy", "countValue", "createdAt", "id", "revision", "status", "updatedAt", "url" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
