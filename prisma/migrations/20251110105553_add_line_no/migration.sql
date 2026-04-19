-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "lineId" TEXT;

-- AlterTable
ALTER TABLE "grievances" ADD COLUMN     "lineId" TEXT;

-- CreateTable
CREATE TABLE "lines" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lines_label_key" ON "lines"("label");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
