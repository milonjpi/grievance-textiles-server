import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

// user login
router.post(
  '/login',
  validateRequest(AuthValidation.login),
  AuthController.login
);

// user public login
router.post(
  '/public-login',
  validateRequest(AuthValidation.publicLogin),
  AuthController.publicLogin
);

// refresh token
router.get(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

// logout
router.post(
  '/logout',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.logout
);

export const AuthRoutes = router;
