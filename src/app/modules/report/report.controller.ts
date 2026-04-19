import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReportService } from './report.service';
import {
  IBuildingWise,
  IDailyMonthlyYearly,
  IDepartmentWise,
  IDeviceWise,
  IDurationWise,
  IGrievanceSubTypeWise,
  IGrievanceTypeWise,
  IOverview,
  IStageWise,
} from './report.interface';
import pick from '../../../shared/pick';
import { reportFilterableFields } from './report.constant';

// overview
const overview = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.overview(filters);

  sendResponse<IOverview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// grievance type wise
const grievanceTypeWise = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.grievanceTypeWise(filters);

  sendResponse<IGrievanceTypeWise[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// grievance sub type wise
const grievanceSubTypeWise = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.grievanceSubTypeWise(filters);

  sendResponse<IGrievanceSubTypeWise[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// department wise
const departmentWise = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.departmentWise(filters);

  sendResponse<IDepartmentWise[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// building wise
const buildingWise = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.buildingWise(filters);

  sendResponse<IBuildingWise[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// device wise
const deviceWise = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.deviceWise();

  sendResponse<IDeviceWise[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// device wise
const stageWise = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.stageWise(filters);

  sendResponse<IStageWise[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// duration wise
const durationWise = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reportFilterableFields);

  const result = await ReportService.durationWise(filters);

  sendResponse<IDurationWise>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

// daily monthly yearly
const dailyMonthlyYearly = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.dailyMonthlyYearly();

  sendResponse<IDailyMonthlyYearly>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report Retrieved successfully',
    data: result,
  });
});

export const ReportCOntroller = {
  overview,
  grievanceTypeWise,
  grievanceSubTypeWise,
  departmentWise,
  buildingWise,
  deviceWise,
  stageWise,
  durationWise,
  dailyMonthlyYearly,
};
