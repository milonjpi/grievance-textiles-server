import { Request, Response } from 'express';
import { GrievanceService } from './grievance.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Grievance } from '@prisma/client';
import pick from '../../../shared/pick';
import { grievanceFilterableFields } from './grievance.constant';
import { paginationFields } from '../../../constants/pagination';
import { JwtPayload } from 'jsonwebtoken';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const user = req.user as JwtPayload;
  data.victimId = user.id;

  const result = await GrievanceService.insertIntoDB(data);

  sendResponse<Grievance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Grievance Added Successfully',
    data: result,
  });
});

// insert response
const insertResponse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const user = req.user as JwtPayload;
  data.responserId = user.id;

  const result = await GrievanceService.insertResponse(id, data);

  sendResponse<Grievance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Response Added Successfully',
    data: result,
  });
});

// insert response
const recordHappiness = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const user = req.user as JwtPayload;
  data.responserId = user.id;

  const result = await GrievanceService.recordHappiness(id, data);

  sendResponse<Grievance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Response Added Successfully',
    data: result,
  });
});

// update response
const updateResponse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await GrievanceService.updateResponse(id, data);

  sendResponse<Grievance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Response Updated Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, grievanceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await GrievanceService.getAll(filters, paginationOptions);

  sendResponse<Grievance[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grievances retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GrievanceService.getSingle(id);

  sendResponse<Grievance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grievance retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await GrievanceService.updateSingle(id, data);

  sendResponse<Grievance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Grievance Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GrievanceService.deleteFromDB(id);

  sendResponse<Grievance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Grievance deleted successfully',
    data: result,
  });
});

// get year
const getGrievanceYear = catchAsync(async (req: Request, res: Response) => {
  const result = await GrievanceService.getGrievanceYear();

  sendResponse<string[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Year Retrieved successfully',
    data: result,
  });
});

export const GrievanceController = {
  insertIntoDB,
  insertResponse,
  recordHappiness,
  updateResponse,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getGrievanceYear,
};
