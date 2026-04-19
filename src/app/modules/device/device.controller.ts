import { Request, Response } from 'express';
import { DeviceService } from './device.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Device } from '@prisma/client';
import pick from '../../../shared/pick';
import { deviceFilterableFields } from './device.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DeviceService.insertIntoDB(data);

  sendResponse<Device>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Device Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, deviceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DeviceService.getAll(filters, paginationOptions);

  sendResponse<Device[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Devices retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DeviceService.getSingle(id);

  sendResponse<Device>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Device retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DeviceService.updateSingle(id, data);

  sendResponse<Device>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Device Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DeviceService.deleteFromDB(id);

  sendResponse<Device>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Device deleted successfully',
    data: result,
  });
});

export const DeviceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
