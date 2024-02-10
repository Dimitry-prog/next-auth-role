'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import AuthHeader from '@/features/auth/components/auth-header';
import AuthSocial from '@/features/auth/components/auth-social';
import AuthBackButton from '@/features/auth/components/auth-back-button';

type CardWrapperProps = {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

const AuthCardWrapper = ({
  children,
  backButtonHref,
  backButtonLabel,
  headerLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="mx-4 w-[400px] border-none bg-gray-400 shadow-md">
      <CardHeader>
        <AuthHeader label={headerLabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>

      {showSocial && (
        <CardFooter>
          <AuthSocial />
        </CardFooter>
      )}

      <CardFooter>
        <AuthBackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthCardWrapper;
