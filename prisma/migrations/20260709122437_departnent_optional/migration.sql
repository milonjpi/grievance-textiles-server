-- DropForeignKey
ALTER TABLE "grievances" DROP CONSTRAINT "grievances_departmentId_fkey";

-- AlterTable
ALTER TABLE "grievances" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
