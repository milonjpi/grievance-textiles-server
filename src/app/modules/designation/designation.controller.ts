import { Request, Response } from 'express';
import { DesignationService } from './designation.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Designation } from '@prisma/client';
import pick from '../../../shared/pick';
import { designationFilterableFields } from './designation.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DesignationService.insertIntoDB(data);

  sendResponse<Designation>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Designation Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, designationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DesignationService.getAll(filters, paginationOptions);

  sendResponse<Designation[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Designations retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DesignationService.getSingle(id);

  sendResponse<Designation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Designation retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DesignationService.updateSingle(id, data);

  sendResponse<Designation>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Designation Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DesignationService.deleteFromDB(id);

  sendResponse<Designation>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Designation deleted successfully',
    data: result,
  });
});

export const DesignationController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
