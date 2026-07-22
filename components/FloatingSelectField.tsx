'use client';
import React, { useState } from 'react';
import Select from '@/components/ui/Select';

type FloatingSelectFieldProps = {
  value?: string;
  required?: boolean;
  validationErrorMessage?: string;
  formGroupClasses?: string;
  floatingLabelClasses?: string;
  selectClasses?: string;
  optionClasses?: string;
  label: string;
  selectOptions: Array<string | number>;
  formControlProps?: object;
};

const FloatingSelectField = (props: FloatingSelectFieldProps) => {
  const [hasValue, setHasValue] = useState<boolean>(Boolean(props.value));
  const [prevValue, setPrevValue] = useState(props.value);

  // Keep the floated state in sync if the value is controlled from outside.
  if (props.value !== prevValue) {
    setPrevValue(props.value);
    setHasValue(Boolean(props.value));
  }

  const { onChange: externalOnChange, ...restFormControlProps } =
    (props.formControlProps ?? {}) as {
      onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
      [key: string]: unknown;
    };

  return (
    <div className={`mb-2 ${props.formGroupClasses ?? ''}`}>
      <div className="relative">
        <Select
          id="floatingSelect"
          required={props.required}
          {...restFormControlProps}
          value={props.value}
          onChange={(e) => {
            setHasValue(Boolean(e.target.value));
            externalOnChange?.(e);
          }}
          className={`peer pt-4 ${props.selectClasses ?? ''}`}
        >
          <option value="" className={props.optionClasses}>
            Select
          </option>
          {props.selectOptions.map((item, index) => (
            <option key={index} className={props.optionClasses}>
              {item}
            </option>
          ))}
        </Select>
        <label
          htmlFor="floatingSelect"
          className={`pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base text-gray-500 transition-all duration-150 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary ${
            hasValue ? 'top-2 translate-y-0 text-xs' : ''
          } ${props.floatingLabelClasses ?? ''}`}
        >
          {props.label}
        </label>
      </div>
      {props.validationErrorMessage && (
        <p className="mt-1 text-sm text-danger">{props.validationErrorMessage}</p>
      )}
    </div>
  );
};

export default FloatingSelectField;
