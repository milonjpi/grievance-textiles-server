import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BuildingPermissionValidation } from './buildingPermission.validation';
import { BuildingPermissionController } from './buildingPermission.controller';

const router = express.Router();

// add building
router.post(
  '/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(BuildingPermissionValidation.create),
  BuildingPermissionController.addBuilding
);

// remove building
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BuildingPermissionController.removeBuilding
);

export const BuildingPermissionRoutes = router;
