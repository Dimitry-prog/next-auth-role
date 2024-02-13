import { User } from '@prisma/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type UserInfoProps = {
  user?: User;
  label: string;
};

const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="bg-gray-300">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">{label}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>

          <p className="max-w-40 truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
            {user?.id}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>

          <p className="max-w-40 truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
            {user?.name}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>

          <p className="max-w-40 truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
            {user?.email}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>

          <p className="max-w-40 truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
            {user?.role}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">2FA</p>

          <Badge variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}>
            {user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
