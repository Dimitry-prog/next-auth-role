import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/lib/auth.config';
import { db } from '@/lib/db';
import { User } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
