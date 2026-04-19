import { Request, Response } from 'express';
import { LocationService } from './location.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Location } from '@prisma/client';
import pick from '../../../shared/pick';
import { locationFilterableFields } from './location.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await LocationService.insertIntoDB(data);

  sendResponse<Location>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Location Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, locationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await LocationService.getAll(filters, paginationOptions);

  sendResponse<Location[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Locations retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await LocationService.getSingle(id);

  sendResponse<Location>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Location retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await LocationService.updateSingle(id, data);

  sendResponse<Location>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Location Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await LocationService.deleteFromDB(id);

  sendResponse<Location>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Location deleted successfully',
    data: result,
  });
});

export const LocationController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
