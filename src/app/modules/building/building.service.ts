import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Building, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingFilters } from './building.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingSearchableFields } from './building.constant';

// create
const insertIntoDB = async (data: Building): Promise<Building | null> => {
  const result = await prisma.building.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.building.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.building.count({
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
const getSingle = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Building>
): Promise<Building | null> => {
  // check is exist
  const isExist = await prisma.building.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building Not Found');
  }

  const result = await prisma.building.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Building');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Building | null> => {
  // check is exist
  const isExist = await prisma.building.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          grievances: true,
          employees: true,
          devices: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building Not Found');
  }

  if (
    isExist._count.grievances ||
    isExist._count.employees ||
    isExist._count.devices
  ) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Building Engaged with ${
        isExist._count.grievances +
        isExist._count.employees +
        isExist._count.devices
      } Docs`
    );
  }

  const result = await prisma.building.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
