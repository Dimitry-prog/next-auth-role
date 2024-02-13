import { currentUser } from '@/lib/current-user';
import UserInfo from '@/components/shared/user-info';

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo label="Server components" user={user} />;
};

export default ServerPage;
