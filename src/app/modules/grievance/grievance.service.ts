import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Grievance, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IGrievanceFilters } from './grievance.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { grievanceSearchableFields } from './grievance.constant';
import { generateTokenNo } from './grievance.utils';
import { sendEmail } from '../../../helpers/sendEmail';
import moment from 'moment';
import { sendSms } from '../../../helpers/sendSms';
import { capitalizeWords } from '../../../shared/utils';
moment.locale('bn');

// create
const insertIntoDB = async (data: Grievance): Promise<Grievance | null> => {
  // generate token
  const tokenNo = await generateTokenNo();
  // set token no
  data.tokenNo = tokenNo;

  const isExist = await prisma.employee.findFirst({
    where: { id: data.victimId, isActive: true },
    include: {
      department: true,
      section: true,
      designation: true,
      floor: true,
      line: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'আপনাকে খুঁজে পাওয়া যায়নি');
  }

  if (isExist.happiness === data.happiness) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'আপনি ইতিমধ্যে জমা দিয়েছেন');
  }

  // set floor building department company
  data.lineId = isExist.lineId;
  data.floorId = isExist.floorId;
  data.buildingId = isExist.buildingId;
  data.departmentId = isExist.departmentId;
  data.companyId = isExist.companyId;

  const result = await prisma.$transaction(async trans => {
    await trans.employee.update({
      where: { id: data.victimId },
      data: {
        happiness: data.isAnonymous ? isExist.happiness : data.happiness,
      },
    });
    return await trans.grievance.create({
      data,
      include: { grievanceType: true },
    });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'কিছু একটা সমস্যা হয়েছে');
  }

  // === After insert, send email ===
  const building = await prisma.building.findUnique({
    where: { id: data.buildingId },
    select: {
      emails: true,
      cc: true,
      bcc: true,
      sms: true,
      floorSms: true,
      label: true,
      labelBn: true,
    },
  });
  const floor = await prisma.floor.findUnique({
    where: { id: data.floorId || '123' },
    select: {
      sms: true,
    },
  });
  const customSetting = await prisma.customSetting.findFirst();

  if (building?.emails?.length) {
    const subject = `New ${
      data?.happiness === 'SAD' ? 'Grievance' : 'Happiness'
    } Submitted - ${building.label}`;

    const html =
      data?.happiness === 'SAD' && data.isAnonymous
        ? `
      <h3>New Grievance Submitted / নতুন অভিযোগ জমা হয়েছে</h3> 
      <p><b>Token / টোকেন:</b> ${result.tokenNo}</p>
      <p><b>Employee / কর্মচারী:</b> Anonymous / বেনামী</p>
      <p><b>Grievance / অভিযোগ:</b> ${
        result.grievanceType?.label + ' / ' + result.grievanceType?.labelBn
      }</p>
      <p><b>Grievance Details / অভিযোগের বিবরণ:</b> ${result.grievance}</p>
      <p><b>Grievance Time / অভিযোগের সময়:</b> ${moment(result.date).format(
        'lll'
      )}</p>
      <p><b>URL:</b> <a href='http://192.168.30.14/pages/grievance-list/${
        result?.id
      }'>Click Here</a></p>
    `
        : `
      <h3>New ${
        data?.happiness === 'SAD' ? 'Grievance' : 'Happiness'
      } Submitted / নতুন ${
            data?.happiness === 'SAD' ? 'অভিযোগ' : 'খুশি'
          } জমা হয়েছে</h3> 
      <p><b>Token / টোকেন:</b> ${result.tokenNo}</p>
      <p><b>Office ID / অফিস আইডি:</b> ${isExist.officeId}</p>
      <p><b>Employee / কর্মচারী:</b> ${isExist.employeeNameBn}</p>
      <p><b>Designation / পদবী:</b> ${isExist.designation?.labelBn}</p>
      <p><b>Department / ডিপার্টমেন্ট:</b> ${isExist.department?.labelBn}</p>
      <p><b>Section / সেকশন:</b> ${isExist.section?.labelBn}</p>
      <p><b>Building / ভবন:</b> ${building?.labelBn || 'প্রযোজ্য নয়'}</p>
      <p><b>Floor / ফ্লোর:</b> ${isExist.floor?.labelBn || 'প্রযোজ্য নয়'}</p>
      <p><b>Line No / লাইন নং:</b> ${
        isExist.line?.labelBn || 'প্রযোজ্য নয়'
      }</p>
      <p><b>${
        data?.happiness === 'SAD' ? 'Grievance / অভিযোগ' : 'Happiness / খুশি'
      }:</b> ${
            result.grievanceType?.label + ' / ' + result.grievanceType?.labelBn
          }</p>
      <p><b>${
        data.happiness === 'SAD'
          ? 'Grievance Time / অভিযোগের সময়'
          : 'Happiness Time / খুশির সময়'
      }:</b> ${moment(result.date).format('lll')}</p>
      <p><b>URL:</b> <a href='http://192.168.30.14/pages/${
        data?.happiness === 'SAD'
          ? 'grievance-list'
          : 'happiness/happiness-list'
      }/${result?.id}'>Click Here</a></p>
    `;

    try {
      await sendEmail(
        building.emails,
        data.isAnonymous ? [] : building.cc ?? [],
        building.bcc || [],
        subject,
        html
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Email sending failed:', error);
    }
  }

  if (data?.happiness === 'SAD' && data.isAnonymous && building?.cc?.length) {
    const subjectAnonymous = `New Anonymous Grievance Submitted - ${building.label}`;

    const htmlAnonymous = `
      <h3>New <span style='color: red;'>Anonymous</span> Grievance Submitted / নতুন <span style='color: red;'>বেনামী</span> অভিযোগ জমা হয়েছে</h3> 
      <p><b>Token / টোকেন:</b> ${result.tokenNo}</p>
      <p><b>Office ID / অফিস আইডি:</b> ${isExist.officeId}</p>
      <p><b>Employee / কর্মচারী:</b> ${isExist.employeeNameBn}</p>
      <p><b>Designation / পদবী:</b> ${isExist.designation?.labelBn}</p>
      <p><b>Department / ডিপার্টমেন্ট:</b> ${isExist.department?.labelBn}</p>
      <p><b>Section / সেকশন:</b> ${isExist.section?.labelBn}</p>
      <p><b>Building / ভবন:</b> ${building?.labelBn || 'প্রযোজ্য নয়'}</p>
      <p><b>Floor / ফ্লোর:</b> ${isExist.floor?.labelBn || 'প্রযোজ্য নয়'}</p>
      <p><b>Line No / লাইন নং:</b> ${
        isExist.line?.labelBn || 'প্রযোজ্য নয়'
      }</p>
      <p><b>Grievance / অভিযোগ:</b> ${
        result.grievanceType?.label + ' / ' + result.grievanceType?.labelBn
      }</p>
      <p><b>Grievance Details / অভিযোগের বিবরণ:</b> ${result.grievance}</p>
      <p><b>Grievance Time / অভিযোগের সময়:</b> ${moment(result.date).format(
        'lll'
      )}</p>
      <p><b>URL:</b> <a href='http://192.168.30.14/pages/grievance-list/${
        result?.id
      }'>Click Here</a></p>
    `;
    try {
      await sendEmail(
        building.cc,
        [],
        building.bcc || [],
        subjectAnonymous,
        htmlAnonymous
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Email sending failed:', error);
    }
  }

  if (
    customSetting?.sms &&
    ((building?.floorSms?.length ?? 0) > 0 || (building?.sms?.length ?? 0) > 0)
  ) {
    const message =
      (data.happiness === 'SAD' && data.isAnonymous
        ? 'An Anonymous Employee'
        : isExist.employeeName +
          ', ' +
          isExist.designation?.label +
          ', ID No. ' +
          isExist.officeId +
          (isExist.line ? ', Line ' + isExist.line.label : '') +
          (isExist.floor ? ', Floor ' + isExist.floor.label : '') +
          ', ' +
          building?.label) +
      ' feeling ' +
      capitalizeWords(data.happiness);
    try {
      const buildingSms = building?.sms || [];
      const buildingFloorSms = building?.floorSms || [];
      const floorSms = floor?.sms || [];

      // Common sms numbers: buildingFloorSms ∩ floorSms
      const commonFloorSms = buildingFloorSms.filter(num =>
        floorSms.includes(num)
      );

      // Final recipients
      const recipients = [...new Set([...buildingSms, ...commonFloorSms])];

      await sendSms(recipients, message);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SMS sending failed:', error);
    }
  }

  return result;
};

// create response
const insertResponse = async (
  id: string,
  payload: Partial<Grievance>
): Promise<Grievance> => {
  // check is exist
  const isExist = await prisma.grievance.findFirst({
    where: {
      id,
      status: 'Pending',
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc Not Found');
  }
  const result = await prisma.grievance.update({
    where: { id },
    data: payload,
  });

  return result;
};

// record happiness
const recordHappiness = async (
  id: string,
  payload: Partial<Grievance>
): Promise<Grievance> => {
  // check is exist
  const isExist = await prisma.grievance.findFirst({
    where: {
      id,
    },
    include: {
      building: true,
      line: true,
      floor: true,
      grievanceType: true,
      victim: {
        include: {
          designation: true,
          department: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc Not Found');
  }
  const result = await prisma.$transaction(async tx => {
    if (isExist.victim.happiness === 'HAPPY' && isExist.status === 'Pending') {
      await tx.employee.update({
        where: { id: isExist.victimId },
        data: { happiness: 'NONE' },
      });
    }

    const grievanceUpdate = await tx.grievance.update({
      where: { id },
      data: payload,
      include: { responseBy: true },
    });

    const customSetting = await prisma.customSetting.findFirst();

    if (payload.status === 'Resolved' && customSetting?.to?.length) {
      const subject = `Happiness has been recorded - ${isExist.building.label}`;
      const html = `
            <h3>Recorded Happiness Details / রেকর্ডকৃত আনন্দের বিবরণ</h3> 
            <p><b>Token / টোকেন:</b> ${isExist.tokenNo}</p>
            <p><b>Happiness Expressers / খুশি প্রকাশকারী:</b> ${
              isExist.victim.employeeNameBn +
              ', ' +
              isExist.victim.designation?.labelBn +
              ', ID No. ' +
              isExist.victim.officeId +
              (isExist.line ? ', Line ' + isExist.line.labelBn : '') +
              (isExist.floor ? ', Floor ' + isExist.floor.labelBn : '') +
              ', ' +
              isExist.building?.labelBn
            }</p>
            <p><b>Happiness Type / খুশির ধরন:</b> ${
              isExist.grievanceType?.labelBn
            }</p>
            <p><b>What Happened / কি হয়েছিল?:</b> ${
              grievanceUpdate.whatHappened
            }</p>
            <p><b>Happy Time / আনন্দের সময়:</b> ${moment(isExist.date).format(
              'lll'
            )}</p>
            <p><b>Recorded Time / রেকর্ড করা সময়:</b> ${moment(
              grievanceUpdate.responseDate
            ).format('lll')}</p>
            <p><b>Who Responded?:</b> ${
              grievanceUpdate.responseBy?.employeeNameBn
            }</p>
            <p><b>URL:</b> <a href='http://192.168.30.14/pages/happiness/recorded-happiness/${
              isExist?.id
            }'>Click Here</a></p>
          `;

      try {
        await sendEmail(
          customSetting.to,
          customSetting.cc || [],
          customSetting.bcc || [],
          subject,
          html
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Email sending failed:', error);
      }
    }

    return grievanceUpdate;
  });

  return result;
};

// update response
const updateResponse = async (
  id: string,
  payload: Partial<Grievance>
): Promise<Grievance> => {
  // check is exist
  const isExist = await prisma.grievance.findFirst({
    where: {
      id,
      status: 'In_Progress',
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Grievance Not Found');
  }

  if (isExist.level !== 'Level_1') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Forbidden!!! Unable to Update');
  }

  const result = await prisma.grievance.update({
    where: { id },
    data: payload,
  });

  return result;
};

// get all
const getAll = async (
  filters: IGrievanceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Grievance[]>> => {
  const {
    searchTerm,
    startDate,
    endDate,
    status,
    buildings,
    floors,
    ...filterData
  } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: grievanceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (status) {
    andConditions.push({ status: { in: JSON.parse(status) } });
  }

  if (status) {
    andConditions.push({ status: { in: JSON.parse(status) } });
  }

  if (buildings) {
    andConditions.push({ buildingId: { in: JSON.parse(buildings) } });
  }

  if (floors) {
    andConditions.push({ floorId: { in: JSON.parse(floors) } });
  }

  if (startDate) {
    andConditions.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }

  if (endDate) {
    andConditions.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.grievance.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      device: {
        include: {
          floor: true,
          building: true,
        },
      },
      victim: {
        include: {
          designation: true,
          department: true,
          section: true,
          subSection: true,
          company: true,
          building: true,
          floor: true,
          line: true,
        },
      },
      responseBy: {
        include: {
          designation: true,
          department: true,
          section: true,
          subSection: true,
          company: true,
          building: true,
          floor: true,
          line: true,
        },
      },
      grievanceType: true,
      grievanceSubType: true,
      withWhom: {
        include: {
          designation: true,
          department: true,
          section: true,
          subSection: true,
          company: true,
          building: true,
          floor: true,
          line: true,
        },
      },
      meetings: {
        orderBy: { createdAt: 'desc' },
        include: {
          committeeMembers: {
            include: {
              designation: true,
              department: true,
              section: true,
              subSection: true,
              company: true,
              building: true,
              floor: true,
              line: true,
            },
            orderBy: [{ code: 'asc' }, { designation: { code: 'asc' } }],
          },
        },
      },
    },
  });

  const total = await prisma.grievance.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single
const getSingle = async (id: string): Promise<Grievance | null> => {
  const result = await prisma.grievance.findFirst({
    where: {
      id,
    },
    include: {
      device: {
        include: {
          floor: true,
          building: true,
        },
      },
      victim: {
        include: {
          designation: true,
          department: true,
          section: true,
          subSection: true,
          company: true,
          building: true,
          floor: true,
          line: true,
        },
      },
      responseBy: {
        include: {
          designation: true,
          department: true,
          section: true,
          subSection: true,
          company: true,
          building: true,
          floor: true,
          line: true,
        },
      },
      grievanceType: true,
      grievanceSubType: true,
      withWhom: {
        include: {
          designation: true,
          department: true,
          section: true,
          subSection: true,
          company: true,
          building: true,
          floor: true,
          line: true,
        },
      },
      meetings: {
        orderBy: { createdAt: 'desc' },
        include: {
          committeeMembers: {
            include: {
              designation: true,
              department: true,
              section: true,
              subSection: true,
              company: true,
              building: true,
              floor: true,
              line: true,
            },
          },
        },
      },
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Grievance>
): Promise<Grievance | null> => {
  // check is exist
  const isExist = await prisma.grievance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Grievance Not Found');
  }

  const result = await prisma.grievance.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Grievance');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Grievance | null> => {
  // check is exist
  const isExist = await prisma.grievance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Grievance Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.grievance.update({
      where: { id },
      data: { meetings: { deleteMany: {} } },
    });

    return await trans.grievance.delete({ where: { id } });
  });

  return result;
};

// spec year
const getGrievanceYear = async (): Promise<string[]> => {
  const years = await prisma.grievance.groupBy({
    by: ['year'],
  });

  const result = years.map(item => item.year);

  return result;
};

export const GrievanceService = {
  insertIntoDB,
  updateResponse,
  insertResponse,
  recordHappiness,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getGrievanceYear,
};
