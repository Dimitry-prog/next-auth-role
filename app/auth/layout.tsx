import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="flex h-full items-center justify-center">{children}</div>;
}
