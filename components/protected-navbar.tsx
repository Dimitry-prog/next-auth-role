'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import UserButton from '@/components/shared/user-button';

const ProtectedNavbar = () => {
  const pathname = usePathname();

  return (
    <header className="w-full max-w-[600px] px-4">
      <nav className="flex items-center justify-between rounded-xl bg-gray-400 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant={pathname === '/server' ? 'default' : 'outline'}>
            <Link href="/server">Server</Link>
          </Button>

          <Button asChild variant={pathname === '/client' ? 'default' : 'outline'}>
            <Link href="/client">Client</Link>
          </Button>

          <Button asChild variant={pathname === '/admin' ? 'default' : 'outline'}>
            <Link href="/admin">Admin</Link>
          </Button>

          <Button asChild variant={pathname === '/settings' ? 'default' : 'outline'}>
            <Link href="/settings">Settings</Link>
          </Button>
        </div>

        <UserButton />
      </nav>
    </header>
  );
};

export default ProtectedNavbar;
