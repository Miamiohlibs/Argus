import { HTMLAttributes } from 'react';

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md';
}

export default function Spinner({ size = 'md', className = '', ...props }: SpinnerProps) {
  const dimension = size === 'sm' ? 'h-4 w-4 border-2' : 'h-6 w-6 border-[3px]';
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block ${dimension} animate-spin rounded-full border-current border-r-transparent align-middle ${className}`}
      {...props}
    />
  );
}
