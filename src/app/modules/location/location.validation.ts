import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Location is Required' }),
    labelBn: z.string({ required_error: 'Location (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const LocationValidation = {
  create,
  update,
};
