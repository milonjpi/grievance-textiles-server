import { z } from 'zod';

const create = z.object({
  body: z.object({
    deviceId: z.string({ required_error: 'Device ID is Required' }),
    floorId: z.string({ required_error: 'Floor ID is Required' }),
  }),
});

export const DevicePermissionValidation = {
  create,
};
