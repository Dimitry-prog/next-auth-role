'use server';

import { SettingsFormType } from '@/features/settings/types';
import { currentUser } from '@/lib/current-user';
import { getUserByEmail, getUserById } from '@/services/user';
import { db } from '@/lib/db';
import { settingsSchema } from '@/features/settings/validation';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';

export const updateSettings = async (values: SettingsFormType) => {
  const validatedFFields = settingsSchema.safeParse(values);

  if (!validatedFFields.success) {
    return {
      error: 'Invalid fields!',
    };
  }

  const user = await currentUser();

  if (!user) {
    return {
      error: 'Unauthorized',
    };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      error: 'Unauthorized',
    };
  }

  const { password, newPassword, email, isTwoFactorEnabled, name, role } = validatedFFields.data;

  if (email && email !== user.email) {
    const existingUser = await getUserByEmail(email);

    if (existingUser && existingUser.id !== user.id) {
      return {
        error: 'Email is already used!',
      };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
      success: 'Verification email sent!',
    };
  }

  let hashedPassword;

  if (password && newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      return {
        error: 'Incorrect password!',
      };
    }

    hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  try {
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        name,
        email,
        role,
        isTwoFactorEnabled,
        password: hashedPassword,
      },
    });

    return {
      success: 'Settings updated!',
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Something went wrong!',
    };
  }
};
