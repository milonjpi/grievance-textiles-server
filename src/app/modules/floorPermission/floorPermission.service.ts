import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FloorPermission } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// add floor
const addFloor = async (
  data: FloorPermission
): Promise<FloorPermission | null> => {
  const result = await prisma.floorPermission.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Floor');
  }

  return result;
};

// remove Floor
const removeFloor = async (id: string): Promise<FloorPermission | null> => {
  // check is exist
  const isExist = await prisma.floorPermission.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Floor Not Found');
  }

  const result = await prisma.floorPermission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FloorPermissionService = {
  addFloor,
  removeFloor,
};
