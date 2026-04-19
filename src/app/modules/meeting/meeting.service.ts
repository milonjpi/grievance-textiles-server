import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Grievance, LevelStatus, Meeting, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import moment from 'moment';
import { sendEmail } from '../../../helpers/sendEmail';
import { IMeetingFilters } from './meeting.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
moment.locale('bn');

// create
const insertIntoDB = async (data: Meeting): Promise<Meeting | null> => {
  // check is exist
  const isExist = await prisma.grievance.findFirst({
    where: {
      id: data.grievanceId,
    },
    include: {
      building: true,
      grievanceType: true,
      victim: { include: { designation: true, department: true } },
      floor: true,
      line: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Grievance Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    const insertMeeting = await trans.meeting.create({
      data,
      include: { committeeMembers: true },
    });

    const grievanceData: Partial<Grievance> = {};

    if (data.status === 'Resolved') {
      grievanceData.resolvedDate = data.releaseTime;
      grievanceData.status = 'Resolved';
      await trans.employee.update({
        where: { id: isExist.victimId },
        data: { happiness: 'NONE' },
      });
    }

    if (data.status === 'In_Progress') {
      grievanceData.level = data.targetLevel as LevelStatus;
    }

    await trans.grievance.update({
      where: { id: data.grievanceId },
      data: grievanceData,
    });

    const customSetting = await prisma.customSetting.findFirst();

    if (data.status === 'Resolved' && customSetting?.to?.length) {
      const subject = `A grievance has been resolved - ${isExist.building.label}`;
      const html = isExist.isAnonymous
        ? `
        <h3>Grievance Resolution Details / অভিযোগ নিষ্পত্তির বিবরণ</h3> 
        <p><b>Token / টোকেন:</b> ${isExist.tokenNo}</p>
        <p><b>Grievance By / অভিযোগকারী:</b> Anonymous / বেনামী</p>
        <p><b>Grievance Type / অভিযোগের ধরণ:</b> ${
          isExist.grievanceType?.labelBn
        }</p>
        <p><b>Grievance Details / অভিযোগের বিবরণ:</b> ${isExist.grievance}</p>
        <p><b>What Happened / কি হয়েছিল?:</b> ${isExist.whatHappened}</p>
        <p><b>Grievance Time / অভিযোগের সময়:</b> ${moment(isExist.date).format(
          'lll'
        )}</p>
        <p><b>Resolved Time / সমাধানের সময়:</b> ${moment(
          data.releaseTime
        ).format('lll')}</p>
      <p><b>Initiative Taken / গৃহীত পদক্ষেপ:</b> ${data.initiativeTaken}</p>
        <p><b>Participants in Resolution / সমাধানে অংশগ্রহণকারীরা:</b> ${insertMeeting.committeeMembers
          ?.map(el => el.employeeNameBn)
          .join(', ')}</p>
        <p><b>URL:</b> <a href='http://192.168.30.14/pages/resolved-grievance/${
          isExist?.id
        }'>Click Here</a></p>
      `
        : `
        <h3>Grievance Resolution Details / অভিযোগ নিষ্পত্তির বিবরণ</h3> 
        <p><b>Token / টোকেন:</b> ${isExist.tokenNo}</p>
        <p><b>Grievance By / অভিযোগকারী:</b> ${
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
        <p><b>Grievance Type / অভিযোগের ধরণ:</b> ${
          isExist.grievanceType?.labelBn
        }</p>
        <p><b>What Happened / কি হয়েছিল?:</b> ${isExist.whatHappened}</p>
        <p><b>Grievance Time / অভিযোগের সময়:</b> ${moment(isExist.date).format(
          'lll'
        )}</p>
        <p><b>Resolved Time / সমাধানের সময়:</b> ${moment(
          data.releaseTime
        ).format('lll')}</p>
      <p><b>Initiative Taken / গৃহীত পদক্ষেপ:</b> ${data.initiativeTaken}</p>
        <p><b>Participants in Resolution / সমাধানে অংশগ্রহণকারীরা:</b> ${insertMeeting.committeeMembers
          ?.map(el => el.employeeNameBn)
          .join(', ')}</p>
        <p><b>URL:</b> <a href='http://192.168.30.14/pages/resolved-grievance/${
          isExist?.id
        }'>Click Here</a></p>
      `;

      try {
        await sendEmail(
          customSetting.to,
          customSetting?.cc || [],
          customSetting?.bcc || [],
          subject,
          html
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Email sending failed:', error);
      }
    }

    return insertMeeting;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Meeting>
): Promise<Meeting | null> => {
  const meeting = await prisma.meeting.findFirst({
    where: { id },
    include: {
      grievance: {
        include: { meetings: true },
      },
      committeeMembers: true,
    },
  });

  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting Not Found');
  }

  const levelConflict = meeting.grievance.meetings.some(
    m => m.level === meeting.targetLevel && m.id !== id
  );
  if (levelConflict) {
    throw new ApiError(httpStatus.BAD_GATEWAY, 'Forbidden!! Unable to Update');
  }

  const committeeMemberIds = meeting.committeeMembers.map(m => ({ id: m.id }));

  const result = await prisma.$transaction(async tx => {
    await tx.meeting.update({
      where: { id },
      data: { committeeMembers: { disconnect: committeeMemberIds } },
    });

    // Update meeting with new payload
    const updatedMeeting = await tx.meeting.update({
      where: { id },
      data: payload,
    });

    // Prepare grievance update data
    const grievanceUpdate: Partial<Grievance> = {};

    if (payload.status === 'Resolved') {
      grievanceUpdate.resolvedDate = payload.releaseTime;
      grievanceUpdate.status = 'Resolved';
      grievanceUpdate.level = meeting.level;

      // Update victim employee happiness
      await tx.employee.update({
        where: { id: meeting.grievance.victimId },
        data: { happiness: 'NONE' },
      });
    }

    if (payload.status === 'In_Progress') {
      grievanceUpdate.resolvedDate = null;
      grievanceUpdate.status = 'In_Progress';
      grievanceUpdate.level = payload.targetLevel as LevelStatus;
      // Update victim employee happiness
      await tx.employee.update({
        where: { id: meeting.grievance.victimId },
        data: { happiness: 'SAD' },
      });
    }

    // Update grievance
    await tx.grievance.update({
      where: { id: meeting.grievanceId },
      data: grievanceUpdate,
    });

    return updatedMeeting;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Meeting');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Meeting | null> => {
  // check is exist
  const isExist = await prisma.meeting.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting Not Found');
  }

  const result = await prisma.meeting.delete({
    where: {
      id,
    },
  });

  return result;
};

// get all
const getAll = async (
  filters: IMeetingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Meeting[]>> => {
  const { member, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (member) {
    andConditions.push({
      committeeMembers: {
        some: {
          id: member,
        },
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

  const whereConditions: Prisma.MeetingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.meeting.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      grievance: {
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
          meetings: true,
          grievanceType: true,
          grievanceSubType: true,
        },
      },
    },
  });

  const total = await prisma.meeting.count({
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

export const MeetingService = {
  insertIntoDB,
  updateSingle,
  deleteFromDB,
  getAll,
};
