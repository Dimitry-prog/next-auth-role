'use client';

import AuthCardWrapper from '@/features/auth/components/auth-card-wrapper';
import Loader from '@/components/shared/loader';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/features/auth/actions';
import FormServerMessage from '@/components/shared/form-server-message';

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [serverMsg, setServerMsg] = useState<{
    error?: string;
    success?: string;
  }>({
    error: '',
    success: '',
  });

  const onSubmit = useCallback(() => {
    if (!token) {
      setServerMsg({
        error: 'Missing token!',
      });
      return;
    }

    newVerification(token).then((res) => {
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
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthCardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {!serverMsg.error && !serverMsg.success && <Loader size="xl" />}

        <FormServerMessage type="error" message={serverMsg.error} />

        <FormServerMessage type="success" message={serverMsg.success} />
      </div>
    </AuthCardWrapper>
  );
};

export default NewVerificationForm;
