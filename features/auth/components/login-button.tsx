'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type LoginButtonProps = {
  children: ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
};

const LoginButton = ({ children, mode = 'redirect', asChild }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push('/auth/login');
  };

  return <span onClick={onClick}>{children}</span>;
};

export default LoginButton;
