import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DevicePermissionValidation } from './devicePermission.validation';
import { DevicePermissionController } from './devicePermission.controller';

const router = express.Router();

// add device
router.post(
  '/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DevicePermissionValidation.create),
  DevicePermissionController.addDevice
);

// remove device
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DevicePermissionController.removeDevice
);

export const DevicePermissionRoutes = router;
