-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StatsKeyValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT,
    "value" INTEGER
);
INSERT INTO "new_StatsKeyValue" ("id", "key", "value") SELECT "id", "key", "value" FROM "StatsKeyValue";
DROP TABLE "StatsKeyValue";
ALTER TABLE "new_StatsKeyValue" RENAME TO "StatsKeyValue";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_StatsKeyValue_2" ON "StatsKeyValue"("key");
Pragma writable_schema=0;
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
