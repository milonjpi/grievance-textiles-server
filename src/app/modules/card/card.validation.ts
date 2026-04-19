import { z } from 'zod';

const create = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    cardNo: z.string({ required_error: 'Card No is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    officeId: z.string().optional(),
    cardNo: z.string().optional(),
  }),
});

export const CardValidation = {
  create,
  update,
};
