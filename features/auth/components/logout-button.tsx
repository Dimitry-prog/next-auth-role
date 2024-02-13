'use client';

import { ReactNode } from 'react';
import { logout } from '@/features/auth/actions';

type LogoutButtonProps = {
  children?: ReactNode;
};

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return <span onClick={onClick}>{children}</span>;
};

export default LogoutButton;
