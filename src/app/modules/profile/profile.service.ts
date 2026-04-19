import { Employee } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import config from '../../../config';

// get profile
const getProfile = async (id: string): Promise<Employee | null> => {
  const result = await prisma.employee.findFirst({
    where: { id },
    include: {
      designation: true,
      department: true,
      section: true,
      subSection: true,
      location: true,
      company: true,
      building: true,
      floor: true,
      line: true,
      card: true,
      menus: true,
      subMenus: true,
      sections: true,
      levels: true,
      buildingPermissions: {
        include: {
          building: true,
        },
      },
      floorPermissions: {
        include: {
          floor: true,
        },
      },
    },
  });

  return result;
};

// update profile
const updateProfile = async (
  id: string,
  payload: Partial<Employee>
): Promise<Employee> => {
  const isExist = await prisma.employee.findFirst({
    where: { id, isActive: true },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your Profile not found');
  }

  const result = await prisma.employee.update({ where: { id }, data: payload });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update your profile');
  }

  return result;
};

// change password
const changePassword = async (
  id: string,
  payload: { oldPassword: string; password: string }
): Promise<Employee> => {
  // checking is exist
  const isExist = await prisma.employee.findFirst({
    where: { id, isActive: true },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your Profile not found');
  }

  // compare old password
  const compareOldPassword = await bcrypt.compare(
    payload.oldPassword,
    isExist?.password
  );

  if (!compareOldPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your Old Password is incorrect'
    );
  }

  // hashing password
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  // update password
  const result = await prisma.employee.update({
    where: { id },
    data: { password: payload.password },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Unable to change your password'
    );
  }

  return result;
};

export const ProfileService = {
  getProfile,
  updateProfile,
  changePassword,
};
