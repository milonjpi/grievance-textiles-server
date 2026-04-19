import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Floor is Required' }),
    labelBn: z.string({ required_error: 'Floor (BN) is Required' }),
    code: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
    code: z.string().optional(),
  }),
});

export const FloorValidation = {
  create,
  update,
};
