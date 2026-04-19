import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Floor, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IFloorFilters } from './floor.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { floorSearchableFields } from './floor.constant';

// create
const insertIntoDB = async (data: Floor): Promise<Floor | null> => {
  const result = await prisma.floor.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IFloorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Floor[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: floorSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.FloorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.floor.findMany({
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

  const total = await prisma.floor.count({
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
const getSingle = async (id: string): Promise<Floor | null> => {
  const result = await prisma.floor.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Floor>
): Promise<Floor | null> => {
  // check is exist
  const isExist = await prisma.floor.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Floor Not Found');
  }

  const result = await prisma.floor.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Floor');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Floor | null> => {
  // check is exist
  const isExist = await prisma.floor.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          grievances: true,
          devices: true,
          employees: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Floor Not Found');
  }

  if (
    isExist._count.grievances ||
    isExist._count.employees ||
    isExist._count.devices
  ) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Floor Engaged with ${
        isExist._count.grievances +
        isExist._count.employees +
        isExist._count.devices
      } Docs`
    );
  }

  const result = await prisma.floor.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FloorService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
