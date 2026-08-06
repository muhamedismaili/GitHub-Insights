-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchlistItemId" TEXT NOT NULL,
    CONSTRAINT "Note_watchlistItemId_fkey" FOREIGN KEY ("watchlistItemId") REFERENCES "WatchlistItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
