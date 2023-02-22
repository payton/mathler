-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "board" TEXT NOT NULL DEFAULT '????????????????????????????????????',
    "colors" TEXT NOT NULL DEFAULT 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "won" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Session_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("board", "colors", "complete", "gameId", "id", "owner") SELECT "board", "colors", "complete", "gameId", "id", "owner" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
