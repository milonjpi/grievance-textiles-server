import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ReportCOntroller } from './report.controller';

const router = express.Router();

// overview
router.get(
  '/overview',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.overview
);

// type wise
router.get(
  '/type-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.grievanceTypeWise
);

// sub-type wise
router.get(
  '/sub-type-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.grievanceSubTypeWise
);

// type wise
router.get(
  '/department-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.departmentWise
);

// type wise
router.get(
  '/building-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.buildingWise
);

// type wise
router.get(
  '/device-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.deviceWise
);

// stage wise
router.get(
  '/stage-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.stageWise
);

// duration wise
router.get(
  '/duration-wise',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.durationWise
);

// daily yearly monthly
router.get(
  '/daily-monthly-yearly',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportCOntroller.dailyMonthlyYearly
);

export const ReportRoutes = router;
