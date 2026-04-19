import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Device, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDeviceFilters } from './device.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { deviceSearchableFields } from './device.constant';

// create
const insertIntoDB = async (data: Device): Promise<Device | null> => {
  const result = await prisma.device.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDeviceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Device[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: deviceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DeviceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.device.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      floor: true,
      building: true,
      devicePermissions: {
        include: {
          floor: true,
        },
      },
    },
  });

  const total = await prisma.device.count({
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
const getSingle = async (id: string): Promise<Device | null> => {
  const result = await prisma.device.findFirst({
    where: {
      id,
    },
    include: {
      floor: true,
      building: true,
      devicePermissions: {
        include: {
          floor: true,
        },
      },
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Device>
): Promise<Device | null> => {
  // check is exist
  const isExist = await prisma.device.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device Not Found');
  }

  const result = await prisma.device.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Device');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Device | null> => {
  // check is exist
  const isExist = await prisma.device.findFirst({
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Device Not Found');
  }

  if (isExist._count.grievances) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Device Engaged with ${isExist._count.grievances} Docs`
    );
  }

  const result = await prisma.device.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DeviceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
