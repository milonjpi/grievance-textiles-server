import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { SubSection, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ISubSectionFilters } from './subSection.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { subSectionSearchableFields } from './subSection.constant';

// create
const insertIntoDB = async (data: SubSection): Promise<SubSection | null> => {
  const result = await prisma.subSection.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ISubSectionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SubSection[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: subSectionSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.SubSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.subSection.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.subSection.count({
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
const getSingle = async (id: string): Promise<SubSection | null> => {
  const result = await prisma.subSection.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<SubSection>
): Promise<SubSection | null> => {
  // check is exist
  const isExist = await prisma.subSection.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sub Section Not Found');
  }

  const result = await prisma.subSection.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Sub Section');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<SubSection | null> => {
  // check is exist
  const isExist = await prisma.subSection.findFirst({
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Sub Section Not Found');
  }

  if (isExist._count.employees) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Sub Section Engaged with ${isExist._count.employees} Docs`
    );
  }

  const result = await prisma.subSection.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SubSectionService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
