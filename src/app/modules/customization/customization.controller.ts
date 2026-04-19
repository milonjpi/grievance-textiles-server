import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CustomSetting } from '@prisma/client';
import { CustomSettingService } from './customization.service';

// get setting
const getSetting = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomSettingService.getSetting();

  sendResponse<CustomSetting>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Setting retrieved successfully',
    data: result,
  });
});

// update setting
const updateSetting = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await CustomSettingService.updateSetting(id, data);

  sendResponse<CustomSetting>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Setting Updated Successfully',
    data: result,
  });
});

// getSmsBalance
const getSmsBalance = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomSettingService.getSmsBalance();

  sendResponse<
    {
      PluginType: string;
      Credits: string;
    }[]
  >(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Balance retrieved successfully',
    data: result,
  });
});

export const CustomSettingController = {
  getSetting,
  updateSetting,
  getSmsBalance,
};
