import { z } from 'zod';
import {
  employeeCategories,
  employeeDivisions,
  genders,
  userRoles,
} from './employee.constant';

const create = z.object({
  body: z.object({
    employeeName: z.string({ required_error: 'Employee Name is Required' }),
    officeId: z.string({ required_error: 'Office ID is Required' }),
    designationId: z.string({ required_error: 'Designation ID is Required' }),
    departmentId: z.string({ required_error: 'Department ID is Required' }),
    sectionId: z.string().optional().nullable(),
    subSectionId: z.string().optional().nullable(),
    companyId: z.string({ required_error: 'Company ID is Required' }),
    locationId: z.string().optional().nullable(),
    gender: z.enum(genders as [string, ...string[]]).optional(),
    category: z.enum(employeeCategories as [string, ...string[]]).optional(),
    division: z.enum(employeeDivisions as [string, ...string[]]).optional(),
    joiningDate: z.string().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    ipPhone: z.string().optional().nullable(),
    mobile: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    lineId: z.string().optional().nullable(),
    floorId: z.string().optional().nullable(),
    buildingId: z.string().optional().nullable(),
    password: z.string({ required_error: 'Password is Required' }),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    profileImg: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    employeeName: z.string().optional(),
    officeId: z.string().optional(),
    designationId: z.string().optional(),
    departmentId: z.string().optional(),
    sectionId: z.string().optional().nullable(),
    subSectionId: z.string().optional().nullable(),
    companyId: z.string().optional(),
    locationId: z.string().optional().nullable(),
    gender: z.enum(genders as [string, ...string[]]).optional(),
    category: z.enum(employeeCategories as [string, ...string[]]).optional(),
    division: z.enum(employeeDivisions as [string, ...string[]]).optional(),
    joiningDate: z.string().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    ipPhone: z.string().optional().nullable(),
    mobile: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    lineId: z.string().optional().nullable(),
    floorId: z.string().optional().nullable(),
    buildingId: z.string().optional().nullable(),
    password: z.string().optional(),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    profileImg: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

const updatePhoto = z.object({
  body: z.object({
    profileImg: z.string({ required_error: 'Profile Image Required' }),
  }),
});

export const EmployeeValidation = {
  create,
  update,
  updatePhoto,
};
