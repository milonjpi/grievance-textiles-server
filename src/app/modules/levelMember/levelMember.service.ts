import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { LevelMember, LevelStatus } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ILevelCreateRemove } from './levelMember.interface';

// create
const insertIntoDB = async (
  data: ILevelCreateRemove
): Promise<LevelMember | null> => {
  const result = await prisma.levelMember.upsert({
    where: { level: data.level },
    create: {
      level: data.level,
      remarks: data.remarks,
      members: { connect: { id: data.employeeId } },
    },
    update: {
      members: { connect: { id: data.employeeId } },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// remove member
const removeMember = async (
  data: ILevelCreateRemove
): Promise<LevelMember | null> => {
  // check is exist
  const isExist = await prisma.levelMember.findFirst({
    where: {
      level: data.level,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc Not Found');
  }

  const result = await prisma.levelMember.update({
    where: { level: data.level },
    data: {
      members: {
        disconnect: { id: data.employeeId },
      },
    },
  });

  return result;
};

// level overview
const levelOverview = async (): Promise<LevelMember[]> => {
  const result = await prisma.levelMember.findMany({
    orderBy: { level: 'asc' },
    include: {
      members: {
        include: {
          designation: true,
          department: true,
          company: true,
          floor: true,
          building: true,
        },
        orderBy: [
          { code: 'asc' },
          { designation: { code: 'asc' } },
          { employeeName: 'asc' },
        ],
      },
    },
  });

  return result;
};

// get single
const getSingle = async (level: LevelStatus): Promise<LevelMember | null> => {
  const result = await prisma.levelMember.findFirst({
    where: {
      level,
    },
    include: {
      members: {
        include: {
          designation: true,
          department: true,
          company: true,
          floor: true,
          building: true,
          buildingPermissions: true,
          floorPermissions: true,
        },
        orderBy: [
          { code: 'asc' },
          { designation: { code: 'asc' } },
          { employeeName: 'asc' },
        ],
      },
    },
  });

  return result;
};

export const LevelMemberService = {
  insertIntoDB,
  removeMember,
  levelOverview,
  getSingle,
};
