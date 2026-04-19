import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DevicePermission } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// add device
const addDevice = async (
  data: DevicePermission
): Promise<DevicePermission | null> => {
  const result = await prisma.devicePermission.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Device');
  }

  return result;
};

// remove Device
const removeDevice = async (id: string): Promise<DevicePermission | null> => {
  // check is exist
  const isExist = await prisma.devicePermission.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device Not Found');
  }

  const result = await prisma.devicePermission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DevicePermissionService = {
  addDevice,
  removeDevice,
};
