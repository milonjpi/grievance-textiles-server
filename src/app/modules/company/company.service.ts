import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Company, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ICompanyFilters } from './company.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { companySearchableFields } from './company.constant';

// create
const insertIntoDB = async (data: Company): Promise<Company | null> => {
  const result = await prisma.company.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ICompanyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Company[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: companySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.CompanyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.company.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.company.count({
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
const getSingle = async (id: string): Promise<Company | null> => {
  const result = await prisma.company.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single
const updateSingle = async (
  id: string,
  payload: Partial<Company>
): Promise<Company | null> => {
  // check is exist
  const isExist = await prisma.company.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company Not Found');
  }

  const result = await prisma.company.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Company');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Company | null> => {
  // check is exist
  const isExist = await prisma.company.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          employees: true,
          grievances: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company Not Found');
  }

  if (isExist._count.employees || isExist._count.grievances) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Company Engaged with ${
        isExist._count.employees + isExist._count.grievances
      } Docs`
    );
  }

  const result = await prisma.company.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CompanyService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
