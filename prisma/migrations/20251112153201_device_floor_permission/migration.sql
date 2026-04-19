-- CreateTable
CREATE TABLE "floorPermissions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floorPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devicePermissions" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devicePermissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "floorPermissions" ADD CONSTRAINT "floorPermissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floorPermissions" ADD CONSTRAINT "floorPermissions_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devicePermissions" ADD CONSTRAINT "devicePermissions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devicePermissions" ADD CONSTRAINT "devicePermissions_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
