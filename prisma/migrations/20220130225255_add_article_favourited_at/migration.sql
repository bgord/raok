-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "newspaperId" TEXT,
    "favourite" BOOLEAN NOT NULL DEFAULT false,
    "favouritedAt" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Article_newspaperId_fkey" FOREIGN KEY ("newspaperId") REFERENCES "Newspaper" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("createdAt", "description", "favourite", "id", "image", "newspaperId", "source", "status", "title", "url") SELECT "createdAt", "description", "favourite", "id", "image", "newspaperId", "source", "status", "title", "url" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
