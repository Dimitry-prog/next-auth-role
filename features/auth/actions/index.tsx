'use server';

import { LoginFormType } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getUserByEmail } from '@/services/user';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signIn } from '@/lib/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import { AuthError } from 'next-auth';

export const login = async (data: LoginFormType) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (e) {
    console.log(e);
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials!',
          };
        default:
          return {
            error: 'Failed to login.',
          };
      }
    }
    throw e;
  }
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
