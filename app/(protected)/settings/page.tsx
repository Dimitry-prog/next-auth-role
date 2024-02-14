import { Card, CardContent, CardHeader } from '@/components/ui/card';
import SettingsForm from '@/features/settings/components/settings-form';

const SettingPage = () => {
  return (
    <Card>
      <CardHeader>
        <p className="text-center text-2xl font-semibold">Settings</p>
      </CardHeader>

      <CardContent>
        <SettingsForm />
      </CardContent>
    </Card>
  );
};

export default SettingPage;
