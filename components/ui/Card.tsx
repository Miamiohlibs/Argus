import { HTMLAttributes } from 'react';

function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded border border-gray-200 bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`border-b border-gray-200 bg-gray-50 px-4 py-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={`text-lg font-medium ${className}`} {...props}>
      {children}
    </h5>
  );
}

export function CardBody({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;

export default Card;
