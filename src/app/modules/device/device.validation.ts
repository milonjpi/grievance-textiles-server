import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Device ID is Required' }),
    floorId: z.string({ required_error: 'Floor ID is Required' }),
    buildingId: z.string({ required_error: 'Floor ID is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Device ID is Required' }),
    floorId: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});

export const DeviceValidation = {
  create,
  update,
};
