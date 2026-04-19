import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Department, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDepartmentFilters } from './department.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { departmentSearchableFields } from './department.constant';

// create
const insertIntoDB = async (data: Department): Promise<Department | null> => {
  const result = await prisma.department.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Department[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: departmentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.DepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.department.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.department.count({
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
const getSingle = async (id: string): Promise<Department | null> => {
  const result = await prisma.department.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Department>
): Promise<Department | null> => {
  // check is exist
  const isExist = await prisma.department.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department Not Found');
  }

  const result = await prisma.department.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Department');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Department | null> => {
  // check is exist
  const isExist = await prisma.department.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          employees: true,
          grievances: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department Not Found');
  }

  if (isExist._count.employees || isExist._count.grievances) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Department Engaged with ${
        isExist._count.employees + isExist._count.grievances
      } Docs`
    );
  }

  const result = await prisma.department.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DepartmentService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
