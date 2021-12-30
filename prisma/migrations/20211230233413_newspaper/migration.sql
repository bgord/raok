-- CreateTable
CREATE TABLE "Newspaper" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "newspaperId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledAt" INTEGER NOT NULL
);
