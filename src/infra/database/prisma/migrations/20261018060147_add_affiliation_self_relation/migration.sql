-- AlterTable
ALTER TABLE "users" ADD COLUMN     "affiliationId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliationId_fkey" FOREIGN KEY ("affiliationId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
