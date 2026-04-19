import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Employee } from '@prisma/client';
import { ProfileService } from './profile.service';
import pick from '../../../shared/pick';
import { updateProfileFields } from './profile.constant';
import { IUser } from '../../../interfaces/common';

// get profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const result = await ProfileService.getProfile(user.id);

  sendResponse<Employee>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const data = pick(req.body, updateProfileFields);

  const result = await ProfileService.updateProfile(user.id, data);

  sendResponse<Employee>(res, {
    statusCode: 200,
    success: true,
    message: 'Profile Updated Successfully',
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const data = req.body;

  const result = await ProfileService.changePassword(user.id, data);

  sendResponse<Employee>(res, {
    statusCode: 200,
    success: true,
    message: 'Password successfully changed',
    data: result,
  });
});

export const ProfileController = {
  getProfile,
  updateProfile,
  changePassword,
};
