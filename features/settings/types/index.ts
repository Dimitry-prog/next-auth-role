import { z } from 'zod';
import { settingsSchema } from '@/features/settings/validation';

export type SettingsFormType = z.infer<typeof settingsSchema>;
