import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { BuildingPermission } from '@prisma/client';
import { BuildingPermissionService } from './buildingPermission.service';

// add Building
const addBuilding = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingPermissionService.addBuilding(data);

  sendResponse<BuildingPermission>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Building Added Successfully',
    data: result,
  });
});

// remove Building
const removeBuilding = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingPermissionService.removeBuilding(id);

  sendResponse<BuildingPermission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building Removed successfully',
    data: result,
  });
});

export const BuildingPermissionController = {
  addBuilding,
  removeBuilding,
};
