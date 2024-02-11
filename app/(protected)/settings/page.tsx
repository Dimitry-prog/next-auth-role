import { auth, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const SettingPage = async () => {
  const sesion = await auth();
  console.log(sesion);
  return (
    <div>
      SettingPage
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
};

export default SettingPage;
