import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const settingsSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).default(UserRole.USER),
    email: z.string().email().optional(),
    isTwoFactorEnabled: z.boolean().default(false).optional(),
    password: z.optional(z.string().min(1, { message: 'Old password is required' })),
    newPassword: z.string().min(1, { message: 'New password is required' }).optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Old password is required!',
      path: ['password'],
    }
  );
