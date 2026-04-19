import { Request, Response } from 'express';
import { DepartmentService } from './department.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Department } from '@prisma/client';
import pick from '../../../shared/pick';
import { departmentFilterableFields } from './department.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DepartmentService.insertIntoDB(data);

  sendResponse<Department>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Department Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, departmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DepartmentService.getAll(filters, paginationOptions);

  sendResponse<Department[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Departments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DepartmentService.getSingle(id);

  sendResponse<Department>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DepartmentService.updateSingle(id, data);

  sendResponse<Department>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Department Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DepartmentService.deleteFromDB(id);

  sendResponse<Department>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department deleted successfully',
    data: result,
  });
});

export const DepartmentController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
