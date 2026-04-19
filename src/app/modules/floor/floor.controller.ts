import { Request, Response } from 'express';
import { FloorService } from './floor.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Floor } from '@prisma/client';
import pick from '../../../shared/pick';
import { floorFilterableFields } from './floor.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FloorService.insertIntoDB(data);

  sendResponse<Floor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Floor Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, floorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FloorService.getAll(filters, paginationOptions);

  sendResponse<Floor[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Floors retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FloorService.getSingle(id);

  sendResponse<Floor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Floor retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await FloorService.updateSingle(id, data);

  sendResponse<Floor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Floor Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FloorService.deleteFromDB(id);

  sendResponse<Floor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Floor deleted successfully',
    data: result,
  });
});

export const FloorController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
