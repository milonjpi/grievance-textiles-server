import {
  Building,
  Department,
  Device,
  GrievanceSubType,
  GrievanceType,
  LevelStatus,
} from '@prisma/client';

export type IReportFilter = {
  happiness?: string;
  buildingId?: string;
  floorId?: string;
  buildings?: string;
  floors?: string;
};

export type IOverview = {
  total: number;
  Pending: number;
  In_Progress: number;
  Resolved: number;
};

export type IGrievanceTypeWise = {
  grievanceType: GrievanceType | undefined;
  Pending: number;
  In_Progress: number;
  Resolved: number;
};

export type IGrievanceSubTypeWise = {
  grievanceSubType: GrievanceSubType | undefined;
  Pending: number;
  In_Progress: number;
  Resolved: number;
};

export type IDepartmentWise = {
  department: Department | undefined;
  Pending: number;
  In_Progress: number;
  Resolved: number;
};

export type IBuildingWise = {
  building: Building | undefined;
  Pending: number;
  In_Progress: number;
  Resolved: number;
};

export type IDeviceWise = {
  device: Device | undefined;
  Pending: number;
  In_Progress: number;
  Resolved: number;
};

export type IStageWise = {
  level: LevelStatus;
  count: number;
};

export type IDurationWise = {
  within1h: number;
  within3h: number;
  within7h: number;
  within12h: number;
  within24h: number;
  within48h: number;
  above48h: number;
};

export type IDailyMonthlyYearly = {
  dayData: number[];
  monthData: number[];
  yearData: number[];
};
