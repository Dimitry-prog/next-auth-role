'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AuthBackButtonProps = {
  label: string;
  href: string;
};

const AuthBackButton = ({ label, href }: AuthBackButtonProps) => {
  return (
    <Button asChild variant="link" size="sm" className="w-full font-normal">
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default AuthBackButton;
