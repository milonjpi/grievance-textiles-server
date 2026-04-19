-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'user');

-- CreateEnum
CREATE TYPE "HappinessIndex" AS ENUM ('NONE', 'HAPPY', 'SAD');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('Pending', 'In_Progress', 'Resolved');

-- CreateEnum
CREATE TYPE "LevelStatus" AS ENUM ('Level_1', 'Level_2', 'Level_3', 'Level_4', 'Level_5');

-- CreateEnum
CREATE TYPE "TargetLevel" AS ENUM ('Resolved', 'Level_1', 'Level_2', 'Level_3', 'Level_4', 'Level_5');

-- CreateEnum
CREATE TYPE "VariationOccurrenceType" AS ENUM ('One_Time', 'Recurring', 'Ongoing');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "EmployeeCategory" AS ENUM ('Management', 'Officer', 'Staff', 'Visitor', 'Worker');

-- CreateEnum
CREATE TYPE "EmployeeDivision" AS ENUM ('RMG', 'Textile');

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "designationId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "sectionId" TEXT,
    "subSectionId" TEXT,
    "companyId" TEXT NOT NULL,
    "locationId" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'Male',
    "category" "EmployeeCategory" NOT NULL DEFAULT 'Management',
    "division" "EmployeeDivision" NOT NULL DEFAULT 'RMG',
    "joiningDate" TIMESTAMP(3),
    "bloodGroup" TEXT,
    "ipPhone" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "floorId" TEXT,
    "buildingId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "profileImg" TEXT,
    "happiness" "HappinessIndex" NOT NULL DEFAULT 'NONE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tokens" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menuPermissions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menuPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subMenuPermissions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subMenuPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectionPermissions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sectionPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '999',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subSections" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subSections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "domain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floors" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '999',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "officeId" TEXT NOT NULL,
    "cardNo" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("officeId")
);

-- CreateTable
CREATE TABLE "demoCards" (
    "officeId" TEXT NOT NULL,
    "cardNo" TEXT NOT NULL,
    "cardNoInt" TEXT NOT NULL,

    CONSTRAINT "demoCards_pkey" PRIMARY KEY ("officeId")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievanceTypes" (
    "id" TEXT NOT NULL,
    "happiness" "HappinessIndex" NOT NULL DEFAULT 'SAD',
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '999',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievanceTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievanceSubTypes" (
    "id" TEXT NOT NULL,
    "grievanceTypeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '999',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievanceSubTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" TEXT NOT NULL,
    "tokenNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "floorId" TEXT,
    "buildingId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "victimId" TEXT NOT NULL,
    "happiness" "HappinessIndex" NOT NULL,
    "responseDate" TIMESTAMP(3),
    "responserId" TEXT,
    "grievanceTypeId" TEXT NOT NULL,
    "grievanceSubTypeId" TEXT,
    "whatHappened" TEXT,
    "whereHappened" TEXT,
    "withWhomId" TEXT,
    "impact" TEXT,
    "variationOccurrence" "VariationOccurrenceType",
    "remarks" TEXT,
    "resolvedDate" TIMESTAMP(3),
    "level" "LevelStatus" NOT NULL DEFAULT 'Level_1',
    "status" "GrievanceStatus" NOT NULL DEFAULT 'Pending',
    "victimFeedback" "HappinessIndex" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "grievanceId" TEXT NOT NULL,
    "level" "LevelStatus" NOT NULL,
    "targetLevel" "TargetLevel" NOT NULL,
    "reason" TEXT NOT NULL,
    "initiativeTaken" TEXT NOT NULL,
    "remarks" TEXT,
    "takenTime" TIMESTAMP(3) NOT NULL,
    "releaseTime" TIMESTAMP(3),
    "status" "GrievanceStatus" NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levelMembers" (
    "id" TEXT NOT NULL,
    "level" "LevelStatus" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levelMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemberOnMeeting" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MembersOnLevel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_officeId_key" ON "employees"("officeId");

-- CreateIndex
CREATE UNIQUE INDEX "designations_label_key" ON "designations"("label");

-- CreateIndex
CREATE UNIQUE INDEX "departments_label_key" ON "departments"("label");

-- CreateIndex
CREATE UNIQUE INDEX "sections_label_key" ON "sections"("label");

-- CreateIndex
CREATE UNIQUE INDEX "subSections_label_key" ON "subSections"("label");

-- CreateIndex
CREATE UNIQUE INDEX "companies_label_key" ON "companies"("label");

-- CreateIndex
CREATE UNIQUE INDEX "locations_label_key" ON "locations"("label");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_label_key" ON "buildings"("label");

-- CreateIndex
CREATE UNIQUE INDEX "floors_label_key" ON "floors"("label");

-- CreateIndex
CREATE UNIQUE INDEX "cards_cardNo_key" ON "cards"("cardNo");

-- CreateIndex
CREATE UNIQUE INDEX "demoCards_cardNo_key" ON "demoCards"("cardNo");

-- CreateIndex
CREATE UNIQUE INDEX "demoCards_cardNoInt_key" ON "demoCards"("cardNoInt");

-- CreateIndex
CREATE UNIQUE INDEX "devices_label_key" ON "devices"("label");

-- CreateIndex
CREATE UNIQUE INDEX "grievanceTypes_happiness_label_key" ON "grievanceTypes"("happiness", "label");

-- CreateIndex
CREATE UNIQUE INDEX "grievanceSubTypes_grievanceTypeId_label_key" ON "grievanceSubTypes"("grievanceTypeId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_tokenNo_key" ON "grievances"("tokenNo");

-- CreateIndex
CREATE UNIQUE INDEX "levelMembers_level_key" ON "levelMembers"("level");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberOnMeeting_AB_unique" ON "_MemberOnMeeting"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberOnMeeting_B_index" ON "_MemberOnMeeting"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MembersOnLevel_AB_unique" ON "_MembersOnLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_MembersOnLevel_B_index" ON "_MembersOnLevel"("B");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "designations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_subSectionId_fkey" FOREIGN KEY ("subSectionId") REFERENCES "subSections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menuPermissions" ADD CONSTRAINT "menuPermissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subMenuPermissions" ADD CONSTRAINT "subMenuPermissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectionPermissions" ADD CONSTRAINT "sectionPermissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "employees"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievanceSubTypes" ADD CONSTRAINT "grievanceSubTypes_grievanceTypeId_fkey" FOREIGN KEY ("grievanceTypeId") REFERENCES "grievanceTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_responserId_fkey" FOREIGN KEY ("responserId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_grievanceTypeId_fkey" FOREIGN KEY ("grievanceTypeId") REFERENCES "grievanceTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_grievanceSubTypeId_fkey" FOREIGN KEY ("grievanceSubTypeId") REFERENCES "grievanceSubTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_withWhomId_fkey" FOREIGN KEY ("withWhomId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_grievanceId_fkey" FOREIGN KEY ("grievanceId") REFERENCES "grievances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberOnMeeting" ADD CONSTRAINT "_MemberOnMeeting_A_fkey" FOREIGN KEY ("A") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberOnMeeting" ADD CONSTRAINT "_MemberOnMeeting_B_fkey" FOREIGN KEY ("B") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembersOnLevel" ADD CONSTRAINT "_MembersOnLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembersOnLevel" ADD CONSTRAINT "_MembersOnLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "levelMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
