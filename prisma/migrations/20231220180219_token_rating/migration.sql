-- CreateTable
CREATE TABLE "TokenRating" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL DEFAULT 0,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL DEFAULT 0
);
