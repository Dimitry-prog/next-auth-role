'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginFormType } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/features/auth/validation';
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
import { login } from '@/features/auth/actions';
import { useState, useTransition } from 'react';
import FormServerMessage from '@/components/shared/form-server-message';
import Loader from '@/components/shared/loader';
import AuthCardWrapper from '@/features/auth/components/auth-card-wrapper';

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [serverMsg, setServerMsg] = useState<{
    error: string;
    success: string;
  }>({
    error: '',
    success: '',
  });

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    setServerMsg({
      error: '',
      success: '',
    });

    startTransition(() => {
      login(data).then((res) => {
        if (res.error) {
          setServerMsg((prev) => ({
            ...prev,
            error: res.error,
          }));
        }
        if (res.success) {
          setServerMsg((prev) => ({
            ...prev,
            success: res.success,
          }));
        }
      });
    });
  };

  return (
    <AuthCardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Dont have any account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="example@gmail.com"
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="*****" type="password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormServerMessage type="error" message={serverMsg.error} />

          <FormServerMessage type="success" message={serverMsg.success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader /> : 'Login'}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default LoginForm;
