'use server';

import { LoginFormType } from '@/features/auth/types';
import { loginSchema, registerSchema } from '@/features/auth/validation';
import { getUserByEmail } from '@/services/user';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const login = async (data: LoginFormType) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: 'Email does not exist!',
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
      success: 'Visit your email to confirm register!',
    };
  }

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
        case 'AuthorizedCallbackError':
          return {
            error: 'Authorized error',
          };
        default:
          return {
            error: 'Something went wrong!',
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

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
      success: 'Confirmation email sent!',
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Database Error: Failed to create user.',
    };
  }
};
