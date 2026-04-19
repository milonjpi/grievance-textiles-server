import { z } from 'zod';
import { happinessIndex } from './grievanceType.constant';

const create = z.object({
  body: z.object({
    happiness: z.enum(happinessIndex as [string, ...string[]], {
      required_error: 'Happiness Index Required',
    }),
    label: z.string({ required_error: 'Grievance Type is Required' }),
    labelBn: z.string({ required_error: 'Grievance Type (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    happiness: z.enum(happinessIndex as [string, ...string[]]).optional(),
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const GrievanceTypeValidation = {
  create,
  update,
};
