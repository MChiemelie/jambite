import { z } from 'zod';

export const AuthSchema = z.object({
  type: z.enum(['sign-in', 'sign-up']),
  email: z.string().email(),
  fullname: z.string().min(2).max(50).optional(),
});