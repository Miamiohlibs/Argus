import { Children, HTMLAttributes, ReactElement, ReactNode, cloneElement, isValidElement } from 'react';

interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function InputGroup({ children, className = '', ...props }: InputGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    className?: string;
  }>[];

  return (
    <div className={`flex items-stretch ${className}`} {...props}>
      {items.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        let joinClasses = '';
        if (items.length > 1) {
          if (isFirst) joinClasses = 'rounded-r-none';
          else if (isLast) joinClasses = 'rounded-l-none -ml-px';
          else joinClasses = 'rounded-none -ml-px';
        }
        return cloneElement(child, {
          key: child.key ?? index,
          className: `${child.props.className ?? ''} ${joinClasses}`.trim(),
        });
      })}
    </div>
  );
}

export function InputGroupText({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`flex items-center whitespace-nowrap rounded border border-gray-300 bg-primary px-3 text-sm font-medium text-white ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
