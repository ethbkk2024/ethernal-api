-- CreateTable
CREATE TABLE "upload_file" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_hash" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upload_file_pkey" PRIMARY KEY ("id")
);
