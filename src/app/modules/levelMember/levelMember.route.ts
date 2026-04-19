import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { LevelMemberValidation } from './levelMember.validation';
import { LevelMemberController } from './levelMember.controller';

const router = express.Router();

// create
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(LevelMemberValidation.create),
  LevelMemberController.insertIntoDB
);

// remove member
router.patch(
  '/remove',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(LevelMemberValidation.remove),
  LevelMemberController.removeMember
);

// level overview
router.get(
  '/overview',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  LevelMemberController.levelOverview
);

// get single
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  LevelMemberController.getSingle
);

export const LevelMemberRoutes = router;
