import { z } from 'zod';

const update = z.object({
  body: z.object({
    employeeName: z.string().optional(),
    designationId: z.string().optional(),
    departmentId: z.string().optional(),
    floorId: z.string().optional().nullable(),
    buildingId: z.string().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    ipPhone: z.string().optional().nullable(),
    mobile: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
  }),
});
const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old Password is Required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const ProfileValidation = {
  update,
  changePassword,
};
