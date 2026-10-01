import { z } from 'zod';
import { USER_ROLES } from '../domain/user.js';

// Schemas validam dados na fronteira antes que eles alcancem as regras de negócio.
export const registerUserSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
  roles: z.array(z.enum(USER_ROLES)).min(1).transform((roles) => [...new Set(roles)]),
});

export const loginUserSchema = z.object({
  // O login usa o mesmo formato de erro para não permitir enumeração de contas.
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string(),
});

export const verifyEmailSchema = z.string().min(1);
