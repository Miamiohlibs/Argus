import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  switch?: boolean;
  wrapperClassName?: string;
  labelHidden?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      switch: isSwitch = false,
      id,
      className = '',
      wrapperClassName = '',
      labelHidden,
      ...props
    },
    ref,
  ) => {
    let labelHiddenClass = '';
    if (labelHidden == true) {
      labelHiddenClass = 'hidden';
    }
    if (isSwitch) {
      return (
        <label
          htmlFor={id}
          className={`inline-flex cursor-pointer items-center gap-2 ${wrapperClassName}`}
        >
          <span className="relative inline-block h-5 w-9 shrink-0">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              role="switch"
              className={`peer sr-only ${className}`}
              {...props}
            />
            <span className="absolute inset-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1" />
            <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </span>
          <span className={`text-base text-gray-900 ${labelHiddenClass}`}>
            {label}
          </span>
        </label>
      );
    }

    return (
      <label
        htmlFor={id}
        className={`inline-flex cursor-pointer items-center gap-2 ${wrapperClassName}`}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-1 focus:ring-primary ${className}`}
          {...props}
        />
        <span className={`text-base text-gray-900 ${labelHiddenClass}`}>
          {label}
        </span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
