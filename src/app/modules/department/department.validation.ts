import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Department is Required' }),
    labelBn: z.string({ required_error: 'Department (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const DepartmentValidation = {
  create,
  update,
};
