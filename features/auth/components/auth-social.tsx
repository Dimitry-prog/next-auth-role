'use client';

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const AuthSocial = () => {
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button asChild variant="outline" size="lg" className="w-full py-2">
        <FcGoogle />
      </Button>

      <Button asChild variant="outline" size="lg" className="w-full py-2">
        <FaGithub />
      </Button>
    </div>
  );
};

export default AuthSocial;
