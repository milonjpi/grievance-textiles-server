import { Request, Response } from 'express';
import { MeetingService } from './meeting.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Meeting } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import pick from '../../../shared/pick';
import { meetingFilterableFields } from './meeting.constant';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const user = req.user as JwtPayload;
  data.creatorId = user.id;

  const result = await MeetingService.insertIntoDB(data);

  sendResponse<Meeting>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meeting Added Successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await MeetingService.updateSingle(id, data);

  sendResponse<Meeting>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meeting Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MeetingService.deleteFromDB(id);

  sendResponse<Meeting>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meeting deleted successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, meetingFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await MeetingService.getAll(filters, paginationOptions);

  sendResponse<Meeting[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meeting retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const MeetingController = {
  insertIntoDB,
  updateSingle,
  deleteFromDB,
  getAll,
};
