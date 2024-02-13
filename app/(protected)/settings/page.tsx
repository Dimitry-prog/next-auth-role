import { auth, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const SettingPage = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div className="">
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
