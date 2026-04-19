import { Request, Response } from 'express';
import { GrievanceSubTypeService } from './grievanceSubType.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { GrievanceSubType } from '@prisma/client';
import pick from '../../../shared/pick';
import { grievanceSubTypeFilterableFields } from './grievanceSubType.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await GrievanceSubTypeService.insertIntoDB(data);

  sendResponse<GrievanceSubType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Type Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, grievanceSubTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await GrievanceSubTypeService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<GrievanceSubType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GrievanceSubTypeService.getSingle(id);

  sendResponse<GrievanceSubType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Type retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await GrievanceSubTypeService.updateSingle(id, data);

  sendResponse<GrievanceSubType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Type Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GrievanceSubTypeService.deleteFromDB(id);

  sendResponse<GrievanceSubType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Type deleted successfully',
    data: result,
  });
});

export const GrievanceSubTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
