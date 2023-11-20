-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reordering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "correlationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Reordering" ("correlationId", "id", "position") SELECT "correlationId", "id", "position" FROM "Reordering";
DROP TABLE "Reordering";
ALTER TABLE "new_Reordering" RENAME TO "Reordering";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
