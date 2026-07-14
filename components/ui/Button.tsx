import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark';

export type ButtonSize = 'sm' | 'md' | 'lg';

const solidClasses: Record<string, string> = {
  primary: 'bg-primary hover:bg-primary-hover border-primary text-white',
  secondary: 'bg-secondary hover:bg-secondary-hover border-secondary text-white',
  success: 'bg-success hover:bg-success-hover border-success text-white',
  danger: 'bg-danger hover:bg-danger-hover border-danger text-white',
  warning: 'bg-warning hover:bg-warning-hover border-warning text-gray-900',
  info: 'bg-info hover:bg-info-hover border-info text-white',
  light: 'bg-light hover:bg-light-hover border-light text-gray-900',
  dark: 'bg-dark hover:bg-dark-hover border-dark text-white',
};

const outlineClasses: Record<string, string> = {
  primary:
    'bg-white text-primary border-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white',
  secondary:
    'bg-white text-secondary border-secondary hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white active:bg-secondary active:text-white',
  success:
    'bg-white text-success border-success hover:bg-success hover:text-white focus:bg-success focus:text-white active:bg-success active:text-white',
  danger:
    'bg-white text-danger border-danger hover:bg-danger hover:text-white focus:bg-danger focus:text-white active:bg-danger active:text-white',
  warning:
    'bg-white text-warning border-warning hover:bg-warning hover:text-gray-900 focus:bg-warning focus:text-gray-900 active:bg-warning active:text-gray-900',
  info: 'bg-white text-info border-info hover:bg-info hover:text-white focus:bg-info focus:text-white active:bg-info active:text-white',
  light:
    'bg-white text-gray-900 border-light hover:bg-light hover:text-gray-900 focus:bg-light focus:text-gray-900 active:bg-light active:text-gray-900',
  dark: 'bg-white text-dark border-dark hover:bg-dark hover:text-white focus:bg-dark focus:text-white active:bg-dark active:text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm gap-1 min-h-[30px]',
  md: 'px-3 py-1.5 text-base gap-1.5 min-h-[38px]',
  lg: 'px-4 py-2 text-lg gap-2 min-h-[46px]',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const isOutline = variant.startsWith('outline-');
  const color = isOutline ? variant.replace('outline-', '') : variant;
  const colorClasses = isOutline ? outlineClasses[color] : solidClasses[color];
  return [
    'inline-flex items-center justify-center rounded border font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current disabled:opacity-65 disabled:pointer-events-none print:hidden',
    sizeClasses[size],
    colorClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses({ variant, size, className })}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export default Button;

export function ButtonGroup({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`inline-flex items-center ${className}`}>{children}</div>;
}
