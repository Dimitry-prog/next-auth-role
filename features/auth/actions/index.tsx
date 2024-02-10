'use server';

import { LoginFormType } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';

export const login = async (data: LoginFormType) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }

  return {
    success: 'Ok',
  };
};

export const register = async (data: LoginFormType) => {
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }

  return {
    success: 'Ok',
  };
};
