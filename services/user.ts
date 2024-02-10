import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
    return {
      error: 'Something went wrong',
    };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
    return {
      error: 'Something went wrong',
    };
  }
};