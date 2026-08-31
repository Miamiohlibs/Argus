import { LabelHTMLAttributes } from 'react';

export default function Label({
  className = '',
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`mb-0 block font-medium text-gray-900 ${className}`} {...props}>
      {children}
    </label>
  );
}
