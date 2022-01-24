-- CreateTable
CREATE TABLE "StatsKeyValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT,
    "value" INTEGER NOT NULL
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_StatsKeyValue_2" ON "StatsKeyValue"("key");
Pragma writable_schema=0;
