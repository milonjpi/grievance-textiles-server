import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Designation, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDesignationFilters } from './designation.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { designationSearchableFields } from './designation.constant';

// create
const insertIntoDB = async (data: Designation): Promise<Designation | null> => {
  const result = await prisma.designation.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDesignationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Designation[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: designationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.DesignationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.designation.findMany({
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

  const total = await prisma.designation.count({
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
const getSingle = async (id: string): Promise<Designation | null> => {
  const result = await prisma.designation.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Designation>
): Promise<Designation | null> => {
  // check is exist
  const isExist = await prisma.designation.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Designation Not Found');
  }

  const result = await prisma.designation.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Designation');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Designation | null> => {
  // check is exist
  const isExist = await prisma.designation.findFirst({
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Designation Not Found');
  }

  if (isExist._count.employees) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Designation Engaged with ${isExist._count.employees} Docs`
    );
  }

  const result = await prisma.designation.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DesignationService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
