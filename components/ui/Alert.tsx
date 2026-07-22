import { HTMLAttributes } from 'react';

export type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

const variantClasses: Record<AlertVariant, string> = {
  primary: 'bg-blue-50 border-primary text-primary',
  secondary: 'bg-gray-100 border-secondary text-secondary',
  success: 'bg-green-50 border-success text-success',
  danger: 'bg-red-50 border-danger text-danger',
  warning: 'bg-yellow-50 border-warning text-yellow-800',
  info: 'bg-cyan-50 border-info text-info',
};

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export default function Alert({ variant = 'info', className = '', children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded border px-4 py-3 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
