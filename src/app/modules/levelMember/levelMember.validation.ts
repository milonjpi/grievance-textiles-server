import { z } from 'zod';
import { levelStatus } from './levelMember.constant';

const create = z.object({
  body: z.object({
    level: z.enum(levelStatus as [string, ...string[]], {
      required_error: 'Level is Required',
    }),
    employeeId: z.string({ required_error: 'Employee ID is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

const remove = z.object({
  body: z.object({
    level: z.enum(levelStatus as [string, ...string[]], {
      required_error: 'Level is Required',
    }),
    employeeId: z.string({ required_error: 'Employee ID is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

export const LevelMemberValidation = {
  create,
  remove,
};
