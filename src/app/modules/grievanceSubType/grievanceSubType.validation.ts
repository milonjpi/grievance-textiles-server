import { z } from 'zod';

const create = z.object({
  body: z.object({
    grievanceTypeId: z.string({ required_error: 'Grievance Type is Required' }),
    label: z.string({ required_error: 'Sub Type is Required' }),
    labelBn: z.string({ required_error: 'Sub Type (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    grievanceTypeId: z.string().optional(),
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const GrievanceSubTypeValidation = {
  create,
  update,
};
