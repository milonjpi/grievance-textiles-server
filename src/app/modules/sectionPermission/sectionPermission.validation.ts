import { z } from 'zod';

const create = z.object({
  body: z.object({
    employeeId: z.string({ required_error: 'Employee ID is Required' }),
    label: z.string({ required_error: 'Section is Required' }),
  }),
});

export const SectionPermissionValidation = {
  create,
};
