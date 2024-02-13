'use client';

import { ReactNode } from 'react';
import { UserRole } from '@prisma/client';
import { useCurrentRole } from '@/hooks/use-current-role';
import FormServerMessage from '@/components/shared/form-server-message';

type RoleGateProps = {
  children?: ReactNode;
  allowedRole: UserRole;
};

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormServerMessage type="error" message="You do not have permission to view this content" />
    );
  }

  return <>{children}</>;
};

export default RoleGate;
