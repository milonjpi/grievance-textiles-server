import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { FloorPermission } from '@prisma/client';
import { FloorPermissionService } from './floorPermission.service';

// add Floor
const addFloor = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FloorPermissionService.addFloor(data);

  sendResponse<FloorPermission>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Floor Added Successfully',
    data: result,
  });
});

// remove Floor
const removeFloor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FloorPermissionService.removeFloor(id);

  sendResponse<FloorPermission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Floor Removed successfully',
    data: result,
  });
});

export const FloorPermissionController = {
  addFloor,
  removeFloor,
};
