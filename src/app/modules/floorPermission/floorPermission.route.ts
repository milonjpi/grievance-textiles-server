import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FloorPermissionValidation } from './floorPermission.validation';
import { FloorPermissionController } from './floorPermission.controller';

const router = express.Router();

// add floor
router.post(
  '/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(FloorPermissionValidation.create),
  FloorPermissionController.addFloor
);

// remove floor
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  FloorPermissionController.removeFloor
);

export const FloorPermissionRoutes = router;
