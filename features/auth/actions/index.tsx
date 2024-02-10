'use server';

import { LoginFormType } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getUserByEmail } from '@/services/user';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

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

  const { email, name, password } = validatedFields.data;

  try {
    const isUserExist = await getUserByEmail(email);

    if (isUserExist) {
      return {
        error: 'Email already in use!',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: 'User created',
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Database Error: Failed to create user.',
    };
  }
};
