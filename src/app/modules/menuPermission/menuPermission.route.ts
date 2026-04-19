import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { MenuPermissionValidation } from './menuPermission.validation';
import { MenuPermissionController } from './menuPermission.controller';

const router = express.Router();

// add menu
router.post(
  '/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(MenuPermissionValidation.create),
  MenuPermissionController.addMenu
);

// remove menu
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MenuPermissionController.removeMenu
);

export const MenuPermissionRoutes = router;
