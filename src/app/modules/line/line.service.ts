import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Line, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ILineFilters } from './line.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { lineSearchableFields } from './line.constant';

// create
const insertIntoDB = async (data: Line): Promise<Line | null> => {
  const result = await prisma.line.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ILineFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Line[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: lineSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.LineWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.line.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.line.count({
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
const getSingle = async (id: string): Promise<Line | null> => {
  const result = await prisma.line.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Line>
): Promise<Line | null> => {
  // check is exist
  const isExist = await prisma.line.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line Not Found');
  }

  const result = await prisma.line.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Line');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Line | null> => {
  // check is exist
  const isExist = await prisma.line.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          grievances: true,
          employees: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line Not Found');
  }

  if (isExist._count.grievances || isExist._count.employees) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Line Engaged with ${
        isExist._count.grievances + isExist._count.employees
      } Docs`
    );
  }

  const result = await prisma.line.delete({
    where: {
      id,
    },
  });

  return result;
};

export const LineService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
