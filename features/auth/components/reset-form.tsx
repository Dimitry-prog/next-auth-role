'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetSchema } from '@/features/auth/validation';
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
import { ResetFormType } from '@/features/auth/types';
import { reset } from '@/features/auth/actions';

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [serverMsg, setServerMsg] = useState<{
    error?: string;
    success?: string;
  }>({
    error: '',
    success: '',
  });

  const form = useForm<ResetFormType>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ResetFormType> = (data) => {
    setServerMsg({
      error: '',
      success: '',
    });

    startTransition(() => {
      reset(data).then((res) => {
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
          </div>

          <FormServerMessage type="error" message={serverMsg.error} />

          <FormServerMessage type="success" message={serverMsg.success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader /> : 'Send reset email'}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};

export default ResetForm;
