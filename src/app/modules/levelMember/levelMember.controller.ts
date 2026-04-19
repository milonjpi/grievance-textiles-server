import { Request, Response } from 'express';
import { LevelMemberService } from './levelMember.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { LevelMember, LevelStatus } from '@prisma/client';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await LevelMemberService.insertIntoDB(data);

  sendResponse<LevelMember>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Member Added Successfully',
    data: result,
  });
});

// remove member
const removeMember = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await LevelMemberService.removeMember(data);

  sendResponse<LevelMember>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Member Removed Successfully',
    data: result,
  });
});

// level overview
const levelOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await LevelMemberService.levelOverview();

  sendResponse<LevelMember[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Members retrieved successfully',
    data: result,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const level = req.params.id as LevelStatus;

  const result = await LevelMemberService.getSingle(level);

  sendResponse<LevelMember>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Members retrieved successfully',
    data: result,
  });
});

export const LevelMemberController = {
  insertIntoDB,
  removeMember,
  levelOverview,
  getSingle,
};
