import { Request, Response } from 'express';
import { SubSectionService } from './subSection.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { SubSection } from '@prisma/client';
import pick from '../../../shared/pick';
import { subSectionFilterableFields } from './subSection.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SubSectionService.insertIntoDB(data);

  sendResponse<SubSection>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Section Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, subSectionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SubSectionService.getAll(filters, paginationOptions);

  sendResponse<SubSection[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Sections retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SubSectionService.getSingle(id);

  sendResponse<SubSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Section retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await SubSectionService.updateSingle(id, data);

  sendResponse<SubSection>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Section Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SubSectionService.deleteFromDB(id);

  sendResponse<SubSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Section deleted successfully',
    data: result,
  });
});

export const SubSectionController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
