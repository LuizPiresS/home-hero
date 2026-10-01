import { z } from 'zod';
import { USER_ROLES } from '../domain/user.js';

export const registerUserSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
  roles: z.array(z.enum(USER_ROLES)).min(1).transform((roles) => [...new Set(roles)]),
});

export const loginUserSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string(),
});

export const verifyEmailSchema = z.string().min(1);
