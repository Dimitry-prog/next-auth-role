import { ReactNode } from 'react';
import ProtectedNavbar from '@/components/protected-navbar';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-10">
      <ProtectedNavbar />
      {children}
    </div>
  );
}
