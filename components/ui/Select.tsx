import { SelectHTMLAttributes, forwardRef } from 'react';
import { inputBaseClasses } from './Input';

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <select ref={ref} className={`${inputBaseClasses} ${className}`} {...props} />
    );
  },
);
Select.displayName = 'Select';

export default Select;
