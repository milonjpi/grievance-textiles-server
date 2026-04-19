import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Sub-Section is Required' }),
    labelBn: z.string({ required_error: 'Sub-Section (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const SubSectionValidation = {
  create,
  update,
};
