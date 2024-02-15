import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LoginButton from '@/features/auth/components/login-button';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md', font.className)}>
          🔐 Auth
        </h1>

        <p className="text-lg text-white"> A simple authentication service</p>

        <div className="space-x-2">
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>

          <LoginButton mode="modal">
            <Button asChild size="lg">
              <p>Sign in with modal</p>
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
