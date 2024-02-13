'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RoleGate from '@/components/shared/role-gate';
import FormServerMessage from '@/components/shared/form-server-message';
import { UserRole } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { adminAction } from '@/features/auth/actions';

const AdminPage = () => {
  const onApiRouterClick = () => {
    fetch('/api/admin').then((res) => {
      if (res.ok) {
        console.log('OKAY');
        toast.success('Allowed API Route!');
      } else {
        console.log('FORBIDDEN');
        toast.error('Forbidden API Route!');
      }
    });
  };

  const onServerAction = () => {
    adminAction().then((res) => {
      if (res.success) {
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    });
  };

  return (
    <Card className="bg-gray-300">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormServerMessage type="success" message="You are allowed to see this content" />
        </RoleGate>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouterClick}>Click to test</Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerAction}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
