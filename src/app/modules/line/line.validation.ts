import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Line is Required' }),
    labelBn: z.string({ required_error: 'Line (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const LineValidation = {
  create,
  update,
};
