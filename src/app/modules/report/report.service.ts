import groupBy from 'lodash.groupby';
import prisma from '../../../shared/prisma';
import {
  IBuildingWise,
  IDailyMonthlyYearly,
  IDepartmentWise,
  IDeviceWise,
  IDurationWise,
  IGrievanceSubTypeWise,
  IGrievanceTypeWise,
  IOverview,
  IReportFilter,
  IStageWise,
} from './report.interface';
import { HappinessIndex, Prisma } from '@prisma/client';
import moment from 'moment';
moment.locale('en');

type DailyGrievance = {
  date: string;
  count: number;
};

// overview
const overview = async (filters: IReportFilter): Promise<IOverview> => {
  const { happiness, buildings, floors } = filters;

  const andConditions = [];

  if (happiness) {
    andConditions.push({
      happiness: happiness as HappinessIndex,
    });
  }

  if (buildings) {
    andConditions.push({ buildingId: { in: JSON.parse(buildings) } });
  }

  if (floors) {
    andConditions.push({ floorId: { in: JSON.parse(floors) } });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.grievance.groupBy({
    where: whereConditions,
    by: ['status'],
    _count: true,
  });

  const counts = result.reduce(
    (acc, { status, _count }) => {
      acc[status] = _count;
      acc.total += _count;
      return acc;
    },
    { Pending: 0, In_Progress: 0, Resolved: 0, total: 0 }
  );

  return counts;
};

// grievance Type wise
const grievanceTypeWise = async (
  filters: IReportFilter
): Promise<IGrievanceTypeWise[]> => {
  const { buildingId, floorId } = filters;

  const andConditions = [];

  if (buildingId) {
    andConditions.push({ buildingId });
  }

  if (floorId) {
    andConditions.push({ floorId });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0
      ? { happiness: 'SAD', AND: andConditions }
      : { happiness: 'SAD' };

  const [grievanceTypes, grievances] = await Promise.all([
    prisma.grievanceType.findMany(),
    prisma.grievance.groupBy({
      where: whereConditions,
      by: ['grievanceTypeId', 'status'],
      _count: true,
    }),
  ]);

  const grouped = groupBy(grievances, 'grievanceTypeId');

  return Object.entries(grouped)
    .map(([typeId, entries]) => {
      const getCount = (status: string) =>
        entries.find(e => e.status === status)?._count || 0;

      return {
        grievanceType: grievanceTypes.find(gri => gri.id === typeId),
        Pending: getCount('Pending'),
        In_Progress: getCount('In_Progress'),
        Resolved: getCount('Resolved'),
      };
    })
    .sort(
      (a, b) =>
        b.Resolved +
        b.In_Progress +
        b.Pending -
        (a.Resolved + a.In_Progress + a.Pending)
    );
};

// grievance Sub-Type wise
const grievanceSubTypeWise = async (
  filters: IReportFilter
): Promise<IGrievanceSubTypeWise[]> => {
  const { buildingId, floorId } = filters;

  const andConditions = [];

  if (buildingId) {
    andConditions.push({ buildingId });
  }

  if (floorId) {
    andConditions.push({ floorId });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0
      ? { happiness: 'SAD', AND: andConditions }
      : { happiness: 'SAD' };

  const [grievanceSubTypes, grievances] = await Promise.all([
    prisma.grievanceSubType.findMany(),
    prisma.grievance.groupBy({
      where: whereConditions,
      by: ['grievanceSubTypeId', 'status'],
      _count: true,
    }),
  ]);

  const grouped = groupBy(grievances, 'grievanceSubTypeId');

  return Object.entries(grouped)
    .map(([typeId, entries]) => {
      const getCount = (status: string) =>
        entries.find(e => e.status === status)?._count || 0;

      return {
        grievanceSubType: grievanceSubTypes.find(gri => gri.id === typeId),
        Pending: getCount('Pending'),
        In_Progress: getCount('In_Progress'),
        Resolved: getCount('Resolved'),
      };
    })
    .sort(
      (a, b) =>
        b.Resolved +
        b.In_Progress +
        b.Pending -
        (a.Resolved + a.In_Progress + a.Pending)
    );
};

// department wise
const departmentWise = async (
  filters: IReportFilter
): Promise<IDepartmentWise[]> => {
  const { buildingId, floorId } = filters;

  const andConditions = [];

  if (buildingId) {
    andConditions.push({ buildingId });
  }

  if (floorId) {
    andConditions.push({ floorId });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0
      ? { happiness: 'SAD', AND: andConditions }
      : { happiness: 'SAD' };

  const [departments, grievances] = await Promise.all([
    prisma.department.findMany(),
    prisma.grievance.groupBy({
      where: whereConditions,
      by: ['departmentId', 'status'],
      _count: true,
    }),
  ]);

  const grouped = groupBy(grievances, 'departmentId');

  return Object.entries(grouped)
    .map(([deptId, entries]) => {
      const getCount = (status: string) =>
        entries.find(e => e.status === status)?._count || 0;

      return {
        department: departments.find(dep => dep.id === deptId),
        Pending: getCount('Pending'),
        In_Progress: getCount('In_Progress'),
        Resolved: getCount('Resolved'),
      };
    })
    .sort(
      (a, b) =>
        b.Resolved +
        b.In_Progress +
        b.Pending -
        (a.Resolved + a.In_Progress + a.Pending)
    );
};

// building wise
const buildingWise = async (
  filters: IReportFilter
): Promise<IBuildingWise[]> => {
  const { floorId } = filters;

  const andConditions = [];

  if (floorId) {
    andConditions.push({ floorId });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0
      ? { happiness: 'SAD', AND: andConditions }
      : { happiness: 'SAD' };

  const [buildings, grievances] = await Promise.all([
    prisma.building.findMany(),
    prisma.grievance.groupBy({
      where: whereConditions,
      by: ['buildingId', 'status'],
      _count: true,
    }),
  ]);

  const grouped = groupBy(grievances, 'buildingId');

  return Object.entries(grouped)
    .map(([bldId, entries]) => {
      const getCount = (status: string) =>
        entries.find(e => e.status === status)?._count || 0;

      return {
        building: buildings.find(bld => bld.id === bldId),
        Pending: getCount('Pending'),
        In_Progress: getCount('In_Progress'),
        Resolved: getCount('Resolved'),
      };
    })
    .sort(
      (a, b) =>
        b.Resolved +
        b.In_Progress +
        b.Pending -
        (a.Resolved + a.In_Progress + a.Pending)
    );
};

// device wise
const deviceWise = async (): Promise<IDeviceWise[]> => {
  const [devices, grievances] = await Promise.all([
    prisma.device.findMany({ include: { building: true, floor: true } }),
    prisma.grievance.groupBy({
      where: { happiness: 'SAD' },
      by: ['deviceId', 'status'],
      _count: true,
    }),
  ]);

  const grouped = groupBy(grievances, 'deviceId');

  return Object.entries(grouped)
    .map(([devId, entries]) => {
      const getCount = (status: string) =>
        entries.find(e => e.status === status)?._count || 0;

      return {
        device: devices.find(dev => dev.id === devId),
        Pending: getCount('Pending'),
        In_Progress: getCount('In_Progress'),
        Resolved: getCount('Resolved'),
      };
    })
    .sort(
      (a, b) =>
        b.Resolved +
        b.In_Progress +
        b.Pending -
        (a.Resolved + a.In_Progress + a.Pending)
    );
};

// stage wise
const stageWise = async (filters: IReportFilter): Promise<IStageWise[]> => {
  const { buildingId, floorId } = filters;

  const andConditions = [];

  if (buildingId) {
    andConditions.push({ buildingId });
  }

  if (floorId) {
    andConditions.push({ floorId });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0
      ? { status: 'Resolved', happiness: 'SAD', AND: andConditions }
      : { status: 'Resolved', happiness: 'SAD' };

  const result = await prisma.grievance.groupBy({
    where: whereConditions,
    by: ['level'],
    _count: true,
  });

  const mappedResult = result.map(el => ({
    level: el.level,
    count: el._count,
  }));

  return mappedResult;
};

// duration wise
const durationWise = async (filters: IReportFilter): Promise<IDurationWise> => {
  const { buildingId, floorId } = filters;

  const andConditions = [];

  if (buildingId) {
    andConditions.push({ buildingId });
  }

  if (floorId) {
    andConditions.push({ floorId });
  }

  const whereConditions: Prisma.GrievanceWhereInput =
    andConditions.length > 0
      ? { status: 'Resolved', happiness: 'SAD', AND: andConditions }
      : { status: 'Resolved', happiness: 'SAD' };

  const grievances = await prisma.grievance.findMany({
    where: whereConditions,
    select: {
      date: true,
      resolvedDate: true,
    },
  });

  const counts = {
    within1h: 0,
    within3h: 0,
    within7h: 0,
    within12h: 0,
    within24h: 0,
    within48h: 0,
    above48h: 0,
  };

  grievances.forEach(g => {
    if (!g.resolvedDate) return;

    const diffMs = g.resolvedDate.getTime() - g.date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours <= 1) counts.within1h++;
    else if (diffHours <= 3) counts.within3h++;
    else if (diffHours <= 7) counts.within7h++;
    else if (diffHours <= 12) counts.within12h++;
    else if (diffHours <= 24) counts.within24h++;
    else if (diffHours <= 48) counts.within48h++;
    else counts.above48h++;
  });

  return counts;
};

// daily monthly yearly
const dailyMonthlyYearly = async (): Promise<IDailyMonthlyYearly> => {
  const today = moment();
  const startDate = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
  const endDate = today.format('YYYY-MM-DD');

  // ========= DAILY =========
  const dailyGrievances = await prisma.$queryRaw<DailyGrievance[]>`
    SELECT DATE("date") AS date, COUNT(*)::int AS count
    FROM "grievances"
    WHERE "date" >= ${startDate}::date
      AND "date" < (${endDate}::date + INTERVAL '1 day')
      AND "happiness" = 'SAD'
      AND "status" = 'Resolved'
    GROUP BY DATE("date")
    ORDER BY DATE("date") ASC
  `;

  const weekdays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const dayData = weekdays.map(
    dayName =>
      dailyGrievances.find(x => moment(x.date).format('ddd') === dayName)
        ?.count ?? 0
  );

  // ========= MONTHLY =========
  const yearNow = today.format('YYYY');

  const monthlyGrievances = await prisma.grievance.groupBy({
    by: ['month'],
    where: { year: yearNow, happiness: 'SAD', status: 'Resolved' },
    _count: true,
  });

  const months = moment.months();

  const monthData = months.map(
    m =>
      monthlyGrievances.find(x => moment(x.month, 'MM').format('MMMM') === m)
        ?._count ?? 0
  );

  // ========= YEARLY =========
  const years = [
    (today.year() - 3).toString(),
    (today.year() - 2).toString(),
    (today.year() - 1).toString(),
    today.year().toString(),
  ];

  const yearlyGrievances = await prisma.grievance.groupBy({
    by: ['year'],
    where: { happiness: 'SAD', status: 'Resolved' },
    _count: true,
  });

  const yearData = years.map(
    y => yearlyGrievances.find(x => x.year === y)?._count ?? 0
  );

  return { dayData, monthData, yearData };
};

export const ReportService = {
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
