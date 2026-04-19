import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Section, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ISectionFilters } from './section.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { sectionSearchableFields } from './section.constant';

// create
const insertIntoDB = async (data: Section): Promise<Section | null> => {
  const result = await prisma.section.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ISectionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Section[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: sectionSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.SectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.section.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.section.count({
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
const getSingle = async (id: string): Promise<Section | null> => {
  const result = await prisma.section.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Section>
): Promise<Section | null> => {
  // check is exist
  const isExist = await prisma.section.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Section Not Found');
  }

  const result = await prisma.section.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Section');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Section | null> => {
  // check is exist
  const isExist = await prisma.section.findFirst({
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Section Not Found');
  }

  if (isExist._count.employees) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Section Engaged with ${isExist._count.employees} Docs`
    );
  }

  const result = await prisma.section.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SectionService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
