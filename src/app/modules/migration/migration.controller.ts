import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { MigrationService } from './migration.service';

// insert employee
const insertEmployee = catchAsync(async (req: Request, res: Response) => {
  const { data } = req.body;

  const result = await MigrationService.insertEmployee(data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Added Successfully',
    data: result,
  });
});

const insertCard = catchAsync(async (req: Request, res: Response) => {
  const { data } = req.body;

  const result = await MigrationService.insertCard(data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Added Successfully',
    data: result,
  });
});

export const MigrationController = {
  insertEmployee,
  insertCard,
};
