import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { GrievanceSubType, HappinessIndex, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IGrievanceSubTypeFilters } from './grievanceSubType.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { grievanceSubTypeSearchableFields } from './grievanceSubType.constant';

// create
const insertIntoDB = async (
  data: GrievanceSubType
): Promise<GrievanceSubType | null> => {
  const result = await prisma.grievanceSubType.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IGrievanceSubTypeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<GrievanceSubType[]>> => {
  const { searchTerm, happiness, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: grievanceSubTypeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (happiness) {
    andConditions.push({
      grievanceType: { happiness: happiness as HappinessIndex },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.GrievanceSubTypeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.grievanceSubType.findMany({
    where: whereConditions,
    orderBy: [
      {
        code: 'asc',
      },
      {
        [sortBy]: sortOrder,
      },
    ],
    skip,
    take: limit,
    include: {
      grievances: true,
    },
  });

  const total = await prisma.grievanceSubType.count({
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
const getSingle = async (id: string): Promise<GrievanceSubType | null> => {
  const result = await prisma.grievanceSubType.findFirst({
    where: {
      id,
    },
    include: {
      grievances: true,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<GrievanceSubType>
): Promise<GrievanceSubType | null> => {
  // check is exist
  const isExist = await prisma.grievanceSubType.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc Not Found');
  }

  const result = await prisma.grievanceSubType.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Doc');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<GrievanceSubType | null> => {
  // check is exist
  const isExist = await prisma.grievanceSubType.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          grievances: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc Not Found');
  }

  if (isExist._count.grievances) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Sub Type Engaged with ${isExist._count.grievances} Docs`
    );
  }

  const result = await prisma.grievanceSubType.delete({
    where: {
      id,
    },
  });

  return result;
};

export const GrievanceSubTypeService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
