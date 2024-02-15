'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthFormType } from '@/features/auth/types';
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
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type AuthFormProps = {
  variant?: 'register' | 'login';
};

const AuthForm = ({ variant = 'login' }: AuthFormProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already use in different provider!'
      : '';
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [serverMsg, setServerMsg] = useState<{
    error?: string;
    success?: string;
  }>({
    error: '',
    success: '',
  });

  const initValues = variant === 'register' ? registerInitValues : loginInitValues;

  const form = useForm<AuthFormType>({
    resolver: zodResolver(variant === 'register' ? registerSchema : loginSchema),
    defaultValues: initValues,
  });

  const onSubmit: SubmitHandler<AuthFormType> = (data) => {
    setServerMsg({
      error: '',
      success: '',
    });

    startTransition(() => {
      if (variant === 'login') {
        login(data, callbackUrl).then((res) => {
          if (res?.error) {
            setServerMsg({
              error: res.error,
            });
          }
          if (res?.success) {
            setServerMsg({
              success: res.success,
            });
          }
          if (res?.twoFactor) {
            setShowTwoFactor(true);
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

            {showTwoFactor && variant === 'login' && (
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="Enter code here" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
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

                      {variant === 'login' && (
                        <Button asChild size="sm" variant="link" className="p-0 font-normal">
                          <Link href="/auth/reset">Forgot password?</Link>
                        </Button>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormServerMessage type="error" message={serverMsg.error || urlError} />

          <FormServerMessage type="success" message={serverMsg.success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader />
            ) : variant === 'login' && !showTwoFactor ? (
              'Login'
            ) : showTwoFactor ? (
              'Confirm'
            ) : (
              'Create an account'
            )}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default AuthForm;
