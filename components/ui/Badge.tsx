import { HTMLAttributes } from 'react';

export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

const colorClasses: Record<BadgeColor, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
  warning: 'bg-warning text-gray-900',
  info: 'bg-info text-white',
  light: 'bg-light text-gray-900 border border-gray-300',
  dark: 'bg-dark text-white',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  bg?: BadgeColor;
}

export default function Badge({ bg = 'primary', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${colorClasses[bg]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
