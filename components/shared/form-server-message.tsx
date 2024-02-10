import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

type FormServerMessageProps = {
  type: 'error' | 'success';
  message?: string;
};

const FormServerMessage = ({ type, message }: FormServerMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        'bg flex items-center gap-x-2 rounded-md  p-3 text-sm',
        type === 'error'
          ? 'bg-destructive/15 text-destructive'
          : 'bg-emerald-500/15 text-emerald-500'
      )}
    >
      {type === 'error' ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}

      <p>{message}</p>
    </div>
  );
};

export default FormServerMessage;
