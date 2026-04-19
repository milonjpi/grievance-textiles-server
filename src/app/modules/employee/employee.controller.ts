import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Employee } from '@prisma/client';
import pick from '../../../shared/pick';
import { employeeFilterableFields } from './employee.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await EmployeeService.insertIntoDB(data);

  sendResponse<Employee>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Employee Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, employeeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EmployeeService.getAll(filters, paginationOptions);

  sendResponse<Employee[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employees retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EmployeeService.getSingle(id);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EmployeeService.updateSingle(id, data);

  sendResponse<Employee>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Employee Updated Successfully',
    data: result,
  });
});

// update photo
const updatePhoto = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EmployeeService.updatePhoto(id, data);

  sendResponse<Employee>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Photo Updated Successfully',
    data: result,
  });
});

// resign employee
const resignEmployee = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EmployeeService.resignEmployee(id);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Resigned successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EmployeeService.deleteFromDB(id);

  sendResponse<Employee>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee deleted successfully',
    data: result,
  });
});

export const EmployeeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  updatePhoto,
  resignEmployee,
  deleteFromDB,
};
