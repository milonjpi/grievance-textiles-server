import { z } from 'zod';

const create = z.object({
  body: z.object({
    employeeId: z.string({ required_error: 'Employee ID is Required' }),
    floorId: z.string({ required_error: 'Floor ID is Required' }),
  }),
});

export const FloorPermissionValidation = {
  create,
};
