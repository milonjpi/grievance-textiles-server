-- CreateTable
CREATE TABLE "buildingPermissions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingPermissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buildingPermissions" ADD CONSTRAINT "buildingPermissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingPermissions" ADD CONSTRAINT "buildingPermissions_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
