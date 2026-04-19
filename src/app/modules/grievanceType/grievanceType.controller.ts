import { Request, Response } from 'express';
import { GrievanceTypeService } from './grievanceType.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { GrievanceType } from '@prisma/client';
import pick from '../../../shared/pick';
import { grievanceTypeFilterableFields } from './grievanceType.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await GrievanceTypeService.insertIntoDB(data);

  sendResponse<GrievanceType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Grievance Type Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, grievanceTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await GrievanceTypeService.getAll(filters, paginationOptions);

  sendResponse<GrievanceType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grievance Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GrievanceTypeService.getSingle(id);

  sendResponse<GrievanceType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grievance Type retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await GrievanceTypeService.updateSingle(id, data);

  sendResponse<GrievanceType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Grievance Type Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GrievanceTypeService.deleteFromDB(id);

  sendResponse<GrievanceType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grievance Type deleted successfully',
    data: result,
  });
});

export const GrievanceTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
