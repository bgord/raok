-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT '-',
    "newspaperId" TEXT,
    "favourite" BOOLEAN NOT NULL DEFAULT false,
    "favouritedAt" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Article_newspaperId_fkey" FOREIGN KEY ("newspaperId") REFERENCES "Newspaper" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("createdAt", "favourite", "favouritedAt", "id", "newspaperId", "source", "status", "title", "url") SELECT "createdAt", "favourite", "favouritedAt", "id", "newspaperId", "source", "status", coalesce("title", '-') AS "title", "url" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
