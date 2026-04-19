import { z } from 'zod';

const login = z.object({
  body: z.object({
    officeId: z.string({ required_error: 'Office ID is Required' }),
    password: z.string({ required_error: 'Password is Required' }),
  }),
});

const publicLogin = z.object({
  body: z.object({
    cardNo: z.string({ required_error: 'কার্ড নম্বর আবশ্যক' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    grievanceTexToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  login,
  publicLogin,
  refreshTokenZodSchema,
};
