import { z } from 'zod';

const create = z.object({
  body: z.object({
    employeeId: z.string({ required_error: 'Employee ID is Required' }),
    buildingId: z.string({ required_error: 'Building ID is Required' }),
  }),
});

export const BuildingPermissionValidation = {
  create,
};
