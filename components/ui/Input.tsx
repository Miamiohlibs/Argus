import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

export const inputBaseClasses =
  'block w-full flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps | TextareaProps>(
  ({ className = '', as = 'input', ...props }, ref) => {
    if (as === 'textarea') {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`${inputBaseClasses} ${className}`}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }
    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        className={`${inputBaseClasses} ${className}`}
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
