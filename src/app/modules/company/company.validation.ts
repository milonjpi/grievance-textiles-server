import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Company is Required' }),
    labelBn: z.string({ required_error: 'Company (BN) is Required' }),
    domain: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
    domain: z.string().optional().nullable(),
  }),
});

export const CompanyValidation = {
  create,
  update,
};
