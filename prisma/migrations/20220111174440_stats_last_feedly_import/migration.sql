-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdArticles" INTEGER NOT NULL DEFAULT 0,
    "sentNewspapers" INTEGER NOT NULL DEFAULT 0,
    "lastFeedlyImport" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Stats" ("createdArticles", "id", "sentNewspapers") SELECT "createdArticles", "id", "sentNewspapers" FROM "Stats";
DROP TABLE "Stats";
ALTER TABLE "new_Stats" RENAME TO "Stats";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
