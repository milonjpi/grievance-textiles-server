import { Request, Response } from 'express';
import { CompanyService } from './company.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Company } from '@prisma/client';
import pick from '../../../shared/pick';
import { companyFilterableFields } from './company.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CompanyService.insertIntoDB(data);

  sendResponse<Company>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Company Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, companyFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CompanyService.getAll(filters, paginationOptions);

  sendResponse<Company[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Companies retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CompanyService.getSingle(id);

  sendResponse<Company>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await CompanyService.updateSingle(id, data);

  sendResponse<Company>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Company Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CompanyService.deleteFromDB(id);

  sendResponse<Company>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company deleted successfully',
    data: result,
  });
});

export const CompanyController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
