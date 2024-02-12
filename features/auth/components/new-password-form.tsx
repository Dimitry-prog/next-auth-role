'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPasswordSchema } from '@/features/auth/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import FormServerMessage from '@/components/shared/form-server-message';
import Loader from '@/components/shared/loader';
import AuthCardWrapper from '@/features/auth/components/auth-card-wrapper';
import { newPassword } from '@/features/auth/actions';
import { NewPasswordFormType } from '@/features/auth/types';
import { useSearchParams } from 'next/navigation';

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPending, startTransition] = useTransition();
  const [serverMsg, setServerMsg] = useState<{
    error?: string;
    success?: string;
  }>({
    error: '',
    success: '',
  });

  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit: SubmitHandler<NewPasswordFormType> = (data) => {
    setServerMsg({
      error: '',
      success: '',
    });

    startTransition(() => {
      newPassword(data, token).then((res) => {
        if (res.error) {
          setServerMsg({
            error: res.error,
          });
        }
        if (res.success) {
          setServerMsg({
            success: res.success,
          });
        }
      });
    });
  };

  return (
    <AuthCardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormServerMessage type="error" message={serverMsg.error} />

          <FormServerMessage type="success" message={serverMsg.success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader /> : 'Reset password'}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default NewPasswordForm;
