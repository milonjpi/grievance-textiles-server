import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { EmployeeRoutes } from '../modules/employee/employee.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { DesignationRoutes } from '../modules/designation/designation.route';
import { DepartmentRoutes } from '../modules/department/department.route';
import { MenuPermissionRoutes } from '../modules/menuPermission/menuPermission.route';
import { SubMenuPermissionRoutes } from '../modules/subMenuPermission/subMenuPermission.route';
import { SectionPermissionRoutes } from '../modules/sectionPermission/sectionPermission.route';
import { CompanyRoutes } from '../modules/company/company.route';
import { FloorRoutes } from '../modules/floor/floor.route';
import { BuildingRoutes } from '../modules/building/building.route';
import { CardRoutes } from '../modules/card/card.route';
import { DeviceRoutes } from '../modules/device/device.route';
import { LevelMemberRoutes } from '../modules/levelMember/levelMember.route';
import { GrievanceTypeRoutes } from '../modules/grievanceType/grievanceType.route';
import { GrievanceRoutes } from '../modules/grievance/grievance.route';
import { MeetingRoutes } from '../modules/meeting/meeting.route';
import { GrievanceSubTypeRoutes } from '../modules/grievanceSubType/grievanceSubType.route';
import { ReportRoutes } from '../modules/report/report.route';
import { SectionRoutes } from '../modules/section/section.route';
import { SubSectionRoutes } from '../modules/subSection/subSection.route';
import { MigrationRoutes } from '../modules/migration/migration.route';
import { LocationRoutes } from '../modules/location/location.route';
import { LineRoutes } from '../modules/line/line.route';
import { BuildingPermissionRoutes } from '../modules/buildingPermission/buildingPermission.route';
import { FloorPermissionRoutes } from '../modules/floorPermission/floorPermission.route';
import { DevicePermissionRoutes } from '../modules/devicePermission/devicePermission.route';
import { CustomSettingRoutes } from '../modules/customization/customization.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/employee',
    route: EmployeeRoutes,
  },
  {
    path: '/migration',
    route: MigrationRoutes,
  },
  {
    path: '/menu-permission',
    route: MenuPermissionRoutes,
  },
  {
    path: '/subMenu-permission',
    route: SubMenuPermissionRoutes,
  },
  {
    path: '/section-permission',
    route: SectionPermissionRoutes,
  },
  {
    path: '/building-permission',
    route: BuildingPermissionRoutes,
  },
  {
    path: '/floor-permission',
    route: FloorPermissionRoutes,
  },
  {
    path: '/device-permission',
    route: DevicePermissionRoutes,
  },
  {
    path: '/designation',
    route: DesignationRoutes,
  },
  {
    path: '/department',
    route: DepartmentRoutes,
  },
  {
    path: '/section',
    route: SectionRoutes,
  },
  {
    path: '/sub-section',
    route: SubSectionRoutes,
  },
  {
    path: '/company',
    route: CompanyRoutes,
  },
  {
    path: '/location',
    route: LocationRoutes,
  },
  {
    path: '/floor',
    route: FloorRoutes,
  },
  {
    path: '/line',
    route: LineRoutes,
  },
  {
    path: '/building',
    route: BuildingRoutes,
  },
  {
    path: '/card',
    route: CardRoutes,
  },
  {
    path: '/device',
    route: DeviceRoutes,
  },
  {
    path: '/grievance-type',
    route: GrievanceTypeRoutes,
  },
  {
    path: '/grievance-sub-type',
    route: GrievanceSubTypeRoutes,
  },
  {
    path: '/level-member',
    route: LevelMemberRoutes,
  },
  {
    path: '/grievance',
    route: GrievanceRoutes,
  },
  {
    path: '/meeting',
    route: MeetingRoutes,
  },
  {
    path: '/report',
    route: ReportRoutes,
  },
  {
    path: '/setting',
    route: CustomSettingRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
