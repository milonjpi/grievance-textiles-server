import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { Card, Employee } from '@prisma/client';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';

// login
const login = async (
  payload: Pick<Employee, 'officeId' | 'password'>
): Promise<ILoginUserResponse> => {
  const { officeId, password } = payload;

  const isUserExist = await prisma.employee.findFirst({
    where: {
      officeId,
      isActive: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
  // create access token and refresh token
  const { id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  const result = await prisma.employee.update({
    where: { officeId },
    data: {
      tokens: {
        push: refreshToken,
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
  }

  return {
    accessToken,
    refreshToken,
  };
};

// public login
const publicLogin = async (
  payload: Pick<Card, 'cardNo'>
): Promise<ILoginUserResponse> => {
  const { cardNo } = payload;

  const isUserExist = await prisma.card.findFirst({
    where: {
      cardNo,
      employee: { isActive: true },
    },
    include: {
      employee: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'আপনি অনুমোদিত নন');
  }

  // create access token and refresh token
  const { id, role } = isUserExist.employee;

  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    '15min'
  );

  return {
    accessToken,
  };
};

// refresh token
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  // checking deleted user's refresh token
  const result = await prisma.employee.findFirst({
    where: {
      id,
      isActive: true,
      tokens: {
        has: token,
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: id,
      role: result?.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

// logout
const logout = async (token: string): Promise<string> => {
  //verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    return 'Logout successfully !';
  }

  const { id } = verifiedToken;

  // token remove from db
  const isExist = await prisma.employee.findFirst({ where: { id } });

  if (!isExist) {
    return 'Logout successfully !';
  }

  await prisma.employee.update({
    where: {
      id,
    },
    data: {
      tokens: isExist.tokens?.filter(el => el !== token),
    },
  });

  return 'Logout successfully !';
};

export const AuthService = {
  login,
  publicLogin,
  refreshToken,
  logout,
};
