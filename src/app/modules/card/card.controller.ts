import { Request, Response } from 'express';
import { CardService } from './card.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Card } from '@prisma/client';
import pick from '../../../shared/pick';
import { cardFilterableFields } from './card.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CardService.insertIntoDB(data);

  sendResponse<Card>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Card Added Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cardFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CardService.getAll(filters, paginationOptions);

  sendResponse<Card[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cards retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CardService.getSingle(id);

  sendResponse<Card>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await CardService.updateSingle(id, data);

  sendResponse<Card>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Card Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CardService.deleteFromDB(id);

  sendResponse<Card>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card deleted successfully',
    data: result,
  });
});

export const CardController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
