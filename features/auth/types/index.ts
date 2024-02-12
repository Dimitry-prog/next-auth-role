import { z } from 'zod';
import {
  loginSchema,
  newPasswordSchema,
  registerSchema,
  resetSchema,
} from '@/features/auth/validation';

export type LoginFormType = z.infer<typeof loginSchema>;

export type RegisterFormType = z.infer<typeof registerSchema>;

export type ResetFormType = z.infer<typeof resetSchema>;

export type NewPasswordFormType = z.infer<typeof newPasswordSchema>;
