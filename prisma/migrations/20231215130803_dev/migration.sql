-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "join_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "money" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "join_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");
