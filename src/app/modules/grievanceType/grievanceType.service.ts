import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { GrievanceType, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IGrievanceTypeFilters } from './grievanceType.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { grievanceTypeSearchableFields } from './grievanceType.constant';

// create
const insertIntoDB = async (
  data: GrievanceType
): Promise<GrievanceType | null> => {
  const result = await prisma.grievanceType.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IGrievanceTypeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<GrievanceType[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: grievanceTypeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.GrievanceTypeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.grievanceType.findMany({
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
  });

  const total = await prisma.grievanceType.count({
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
const getSingle = async (id: string): Promise<GrievanceType | null> => {
  const result = await prisma.grievanceType.findFirst({
    where: {
      id,
    },
    include: {
      grievanceSubTypes: {
        orderBy: {
          code: 'asc',
        },
        include: {
          _count: {
            select: {
              grievances: true,
            },
          },
        },
      },
      _count: {
        select: { grievances: true },
      },
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<GrievanceType>
): Promise<GrievanceType | null> => {
  // check is exist
  const isExist = await prisma.grievanceType.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc Not Found');
  }

  const result = await prisma.grievanceType.update({
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
const deleteFromDB = async (id: string): Promise<GrievanceType | null> => {
  // check is exist
  const isExist = await prisma.grievanceType.findFirst({
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
      `Type Engaged with ${isExist._count.grievances} Docs`
    );
  }

  const result = await prisma.grievanceType.delete({
    where: {
      id,
    },
  });

  return result;
};

export const GrievanceTypeService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
