import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../../shared/prisma';
import { Employee, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { IEmployeeFilters } from './employee.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { employeeSearchableFields } from './employee.constant';

// create
const insertIntoDB = async (data: Employee): Promise<Employee | null> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await prisma.employee.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IEmployeeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Employee[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: employeeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.EmployeeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.employee.findMany({
    where: whereConditions,
    orderBy: [
      {
        department: {
          label: 'asc',
        },
      },
      {
        code: 'asc',
      },
      {
        designation: {
          code: 'asc',
        },
      },
      {
        [sortBy]: sortOrder,
      },
    ],
    skip,
    take: limit,
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
    },
  });

  const total = await prisma.employee.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single
const getSingle = async (id: string): Promise<Employee | null> => {
  const result = await prisma.employee.findFirst({
    where: {
      id,
    },
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

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Employee>
): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  // hashing password
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const result = await prisma.employee.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Employee');
  }

  return result;
};

// update photo
const updatePhoto = async (
  id: string,
  payload: Partial<Employee>
): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  const result = await prisma.employee.update({
    where: {
      id,
    },
    data: { profileImg: payload.profileImg },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Employee');
  }

  return result;
};

// resign employee
const resignEmployee = async (id: string): Promise<Employee | null> => {
  const isExist = await prisma.employee.findUnique({
    where: { id },
    include: {
      card: true,
      levels: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    isActive: false,
  };

  if (isExist.card) {
    data.card = { delete: true };
  }

  if (isExist.levels && isExist.levels.length > 0) {
    data.levels = { deleteMany: {} };
  }

  const result = await prisma.employee.update({
    where: { id },
    data,
  });

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Employee | null> => {
  // check is exist
  const isExist = await prisma.employee.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Not Found');
  }

  const result = await prisma.employee.delete({
    where: {
      id,
    },
  });

  return result;
};

export const EmployeeService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  updatePhoto,
  resignEmployee,
  deleteFromDB,
};
