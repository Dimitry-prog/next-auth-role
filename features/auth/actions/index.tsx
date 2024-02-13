'use server';

import { LoginFormType, NewPasswordFormType, ResetFormType } from '@/features/auth/types';
import {
  loginSchema,
  newPasswordSchema,
  registerSchema,
  resetSchema,
} from '@/features/auth/validation';
import { getUserByEmail } from '@/services/user';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { sendPasswordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import { getVerificationTokenByToken } from '@/services/verification-token';
import { getPasswordResetTokenByToken } from '@/services/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/services/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/services/two-factor-confirmation';

export const login = async (data: LoginFormType) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }

  const { email, password, code } = validatedFields.data;
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

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          error: 'Invalid code!',
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          error: 'Invalid code!',
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return {
          error: 'Code expired!',
        };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        twoFactor: true,
      };
    }
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

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: 'Token does not exist',
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: 'Token has expired!',
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: 'Email does not exist!',
    };
  }

  try {
    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return {
      success: ' Email verified!',
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Something went wrong!',
    };
  }
};

export const reset = async (values: ResetFormType) => {
  const validatedField = resetSchema.safeParse(values);

  if (!validatedField.success) {
    return {
      error: 'Invalid email!',
    };
  }

  const { email } = validatedField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: 'Email not found!',
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: 'Reset email sent!' };
};

export const newPassword = async (values: NewPasswordFormType, token?: string | null) => {
  if (!token) {
    return {
      error: 'Missing token!',
    };
  }

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid password!',
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token!);

  if (!existingToken) {
    return {
      error: 'Invalid token!',
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: 'Token has expired!',
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: 'Email does not exist!',
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return {
      success: 'Password updated!',
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Something went wrong!',
    };
  }
};
