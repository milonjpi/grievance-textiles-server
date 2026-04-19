import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';

// login
const login = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.login(data);

  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: false,
    httpOnly: true,
    maxAge: parseInt(config.jwt.cookie_max_age || '31536000000'),
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  res.cookie('grievanceTexToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successfully!',
    data: others,
  });
});

// public login
const publicLogin = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.publicLogin(data);


  sendResponse<ILoginUserResponse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'আপনি সফলভাবে প্রবেশ করেছেন',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { grievanceTexToken } = req.cookies;

  const result = await AuthService.refreshToken(grievanceTexToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Token Refreshed successfully !',
    data: result,
  });
});

// logout
const logout = catchAsync(async (req: Request, res: Response) => {
  const { grievanceTexToken } = req.cookies;

  const result = await AuthService.logout(grievanceTexToken);

  res.clearCookie('grievanceTexToken');

  sendResponse<string>(res, {
    statusCode: 200,
    success: true,
    message: 'Logout successfully !',
    data: result,
  });
});

export const AuthController = {
  login,
  publicLogin,
  logout,
  refreshToken,
};
