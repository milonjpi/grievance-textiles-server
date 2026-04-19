import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingPermission } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// add building
const addBuilding = async (
  data: BuildingPermission
): Promise<BuildingPermission | null> => {
  const result = await prisma.buildingPermission.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Building');
  }

  return result;
};

// remove Building
const removeBuilding = async (
  id: string
): Promise<BuildingPermission | null> => {
  // check is exist
  const isExist = await prisma.buildingPermission.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building Not Found');
  }

  const result = await prisma.buildingPermission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingPermissionService = {
  addBuilding,
  removeBuilding,
};
