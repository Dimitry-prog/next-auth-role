import AuthCardWrapper from '@/features/auth/components/auth-card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const AuthErrorCard = () => {
  return (
    <AuthCardWrapper
      headerLabel="Something went wrong"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center text-destructive">
        <ExclamationTriangleIcon />
      </div>
    </AuthCardWrapper>
  );
};

export default AuthErrorCard;
