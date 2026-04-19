import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { DevicePermission } from '@prisma/client';
import { DevicePermissionService } from './devicePermission.service';

// add Device
const addDevice = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DevicePermissionService.addDevice(data);

  sendResponse<DevicePermission>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Device Added Successfully',
    data: result,
  });
});

// remove Device
const removeDevice = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DevicePermissionService.removeDevice(id);

  sendResponse<DevicePermission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Device Removed successfully',
    data: result,
  });
});

export const DevicePermissionController = {
  addDevice,
  removeDevice,
};
