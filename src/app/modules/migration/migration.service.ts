/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import config from '../../../config';
const prisma = new PrismaClient();

const insertEmployee = async (data: any[]): Promise<string> => {
  await Promise.all(
    data.map(async el => {
      // is exist function
      const upsertIfExists = (model: any, label?: string, labelBn?: string) =>
        label
          ? model.upsert({
              where: { label },
              create: { label, labelBn },
              update: { labelBn },
            })
          : null;

      // upsert related fields
      const [
        designation,
        department,
        section,
        subSection,
        location,
        company,
        floor,
        line,
        building,
      ] = await Promise.all([
        upsertIfExists(prisma.designation, el.designation, el.designationBn),
        upsertIfExists(prisma.department, el.department, el.departmentBn),
        upsertIfExists(prisma.section, el.section, el.sectionBn),
        upsertIfExists(prisma.subSection, el.subSection, el.subSectionBn),
        upsertIfExists(prisma.location, el.location, el.locationBn),
        upsertIfExists(prisma.company, el.company, el.companyBn),
        upsertIfExists(prisma.floor, el.floor, el.floorBn),
        upsertIfExists(prisma.line, el.line, el.lineBn),
        upsertIfExists(prisma.building, el.building, el.buildingBn),
      ]);

      // hashing password
      const hashedPassword = await bcrypt.hash(
        el.password || 'gms123',
        Number(config.bcrypt_salt_rounds)
      );

      // common fields
      const baseData = {
        employeeName: el.employeeName,
        employeeNameBn: el.employeeNameBn,
        designationId: designation?.id ?? null,
        departmentId: department?.id ?? null,
        sectionId: section?.id ?? null,
        subSectionId: subSection?.id ?? null,
        companyId: company?.id ?? null,
        locationId: location?.id ?? null,
        category: el.category,
        division: el.division,
        joiningDate: el.joiningDate,
        bloodGroup: el.bloodGroup,
        ipPhone: el.ipPhone,
        mobile: el.mobile,
        email: el.email || el.mobile,
        floorId: floor?.id ?? null,
        lineId: line?.id ?? null,
        buildingId: building?.id ?? null,
      };

      // upsert employee
      await prisma.employee.upsert({
        where: { officeId: el.officeId },
        create: {
          ...baseData,
          officeId: el.officeId,
          gender: el.gender,
          password: hashedPassword,
        },
        update: baseData,
      });
    })
  );

  return 'success';
};

const insertCard = async (data: any[]): Promise<string> => {
  await Promise.all(
    data.map(async ({ officeId, cardNo }) => {
      const employeeExists = await prisma.employee.findFirst({
        where: { officeId },
        select: { id: true },
      });

      if (employeeExists && cardNo) {
        await prisma.card.upsert({
          where: { officeId },
          create: { officeId, cardNo },
          update: { cardNo },
        });
      }
    })
  );

  return 'success';
};

export const MigrationService = {
  insertEmployee,
  insertCard,
};
