'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginFormType, RegisterFormType } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '@/features/auth/validation';
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
import { login, register } from '@/features/auth/actions';
import { useState, useTransition } from 'react';
import FormServerMessage from '@/components/shared/form-server-message';
import Loader from '@/components/shared/loader';
import { loginInitValues, registerInitValues } from '@/features/auth/utils/constants';
import AuthCardWrapper from '@/features/auth/components/auth-card-wrapper';

type AuthFormProps = {
  variant?: 'register' | 'login';
};

const AuthForm = ({ variant = 'login' }: AuthFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [serverMsg, setServerMsg] = useState<{
    error: string;
    success: string;
  }>({
    error: '',
    success: '',
  });

  type FormType = typeof variant extends 'register' ? LoginFormType : RegisterFormType;
  const initValues = variant === 'register' ? registerInitValues : loginInitValues;

  const form = useForm<FormType>({
    resolver: zodResolver(variant === 'register' ? registerSchema : loginSchema),
    defaultValues: initValues,
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    setServerMsg({
      error: '',
      success: '',
    });

    startTransition(() => {
      if (variant === 'login') {
        login(data).then((res) => {
          if (res?.error) {
            setServerMsg((prev) => ({
              ...prev,
              error: res.error,
            }));
          }
        });
      } else {
        register(data).then((res) => {
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
      }
    });
  };

  return (
    <AuthCardWrapper
      headerLabel={variant === 'login' ? 'Welcome back!' : 'Create an account'}
      backButtonLabel={variant === 'login' ? 'Dont have any account?' : 'Already have an account?'}
      backButtonHref={variant === 'login' ? '/auth/register' : '/auth/login'}
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {variant === 'register' && (
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
            {isPending ? <Loader /> : variant === 'login' ? 'Login' : 'Create an account'}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default AuthForm;
