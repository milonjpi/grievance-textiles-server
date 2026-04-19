import { z } from 'zod';
import { happinessIndex } from './grievance.constant';

const create = z.object({
  body: z.object({
    deviceId: z.string({ required_error: 'Device ID is Required' }),
    grievance: z.string().optional().nullable(),
    grievanceTypeId: z.string({
      required_error: 'Grievance Type ID is Required',
    }),
    date: z.string({ required_error: 'Date is Required' }),
    year: z.string({ required_error: 'Year is Required' }),
    month: z.string({ required_error: 'Month is Required' }),
    happiness: z.enum(happinessIndex as [string, ...string[]], {
      required_error: 'Happiness Index Required',
    }),
    victimFeedback: z.enum(happinessIndex as [string, ...string[]]).optional(),
  }),
});

const update = z.object({
  body: z.object({
    deviceId: z.string().optional(),
    grievance: z.string().optional().nullable(),
    grievanceTypeId: z.string().optional(),
    date: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
    happiness: z.enum(happinessIndex as [string, ...string[]]).optional(),
    victimFeedback: z.enum(happinessIndex as [string, ...string[]]).optional(),
  }),
});

export const GrievanceValidation = {
  create,
  update,
};
