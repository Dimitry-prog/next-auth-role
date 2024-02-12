'use client';

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';

const AuthSocial = () => {
  const handleLogin = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        onClick={() => handleLogin('google')}
        asChild
        variant="outline"
        size="lg"
        className="w-full py-2"
      >
        <FcGoogle />
      </Button>

      <Button
        onClick={() => handleLogin('github')}
        asChild
        variant="outline"
        size="lg"
        className="w-full py-2"
      >
        <FaGithub />
      </Button>
    </div>
  );
};

export default AuthSocial;
