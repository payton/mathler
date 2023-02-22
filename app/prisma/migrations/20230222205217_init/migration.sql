-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "board" TEXT NOT NULL DEFAULT '????????????????????????????????????',
    "colors" TEXT NOT NULL DEFAULT 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "won" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
