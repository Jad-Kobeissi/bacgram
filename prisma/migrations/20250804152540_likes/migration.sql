-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."_likedPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_likedPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_likedPosts_B_index" ON "public"."_likedPosts"("B");

-- AddForeignKey
ALTER TABLE "public"."_likedPosts" ADD CONSTRAINT "_likedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_likedPosts" ADD CONSTRAINT "_likedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
