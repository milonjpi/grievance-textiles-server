import { Request, Response } from 'express';
import { SectionService } from './section.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Section } from '@prisma/client';
import pick from '../../../shared/pick';
import { sectionFilterableFields } from './section.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SectionService.insertIntoDB(data);

  sendResponse<Section>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Section Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, sectionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SectionService.getAll(filters, paginationOptions);

  sendResponse<Section[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sections retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SectionService.getSingle(id);

  sendResponse<Section>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Section retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await SectionService.updateSingle(id, data);

  sendResponse<Section>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Section Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SectionService.deleteFromDB(id);

  sendResponse<Section>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Section deleted successfully',
    data: result,
  });
});

export const SectionController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
