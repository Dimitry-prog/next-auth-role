'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FaUser } from 'react-icons/fa6';
import LogoutButton from '@/features/auth/components/logout-button';
import { ExitIcon } from '@radix-ui/react-icons';

const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          <AvatarImage src={user?.image || ''} />

          <AvatarFallback className="bg-gray-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
