import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Location, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ILocationFilters } from './location.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { locationSearchableFields } from './location.constant';

// create
const insertIntoDB = async (data: Location): Promise<Location | null> => {
  const result = await prisma.location.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ILocationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Location[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: locationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.LocationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.location.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.location.count({
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
const getSingle = async (id: string): Promise<Location | null> => {
  const result = await prisma.location.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Location>
): Promise<Location | null> => {
  // check is exist
  const isExist = await prisma.location.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
  }

  const result = await prisma.location.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Location');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Location | null> => {
  // check is exist
  const isExist = await prisma.location.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          employees: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
  }

  if (isExist._count.employees) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Location Engaged with ${isExist._count.employees} Docs`
    );
  }

  const result = await prisma.location.delete({
    where: {
      id,
    },
  });

  return result;
};

export const LocationService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
