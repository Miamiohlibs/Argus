'use client';

import Link from 'next/link';
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ButtonSize, ButtonVariant, buttonClasses } from './Button';

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error('Dropdown.* components must be rendered within a <Dropdown>');
  }
  return ctx;
}

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Dropdown({ children, className = '', ...props }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, toggleRef }}>
      <div ref={containerRef} className={`relative inline-block ${className}`} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function DropdownToggle({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: DropdownToggleProps) {
  const { open, setOpen, toggleRef } = useDropdownContext();
  return (
    <button
      ref={toggleRef}
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenu({
  children,
  className = '',
  align = 'end',
}: {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'end';
}) {
  const { open } = useDropdownContext();
  if (!open) return null;
  return (
    <div
      role="menu"
      className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} z-20 mt-1 min-w-40 rounded border border-gray-200 bg-white py-1 shadow-lg print:hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
}

export function DropdownItem({ children, href, onClick, className = '' }: DropdownItemProps) {
  const { setOpen } = useDropdownContext();
  const itemClassName = `block w-full whitespace-nowrap px-3 py-1.5 text-left text-sm text-gray-900 hover:bg-gray-100 ${className}`;

  const handleClick = (event: React.MouseEvent) => {
    onClick?.(event);
    setOpen(false);
  };

  if (href) {
    return (
      <Link href={href} role="menuitem" className={itemClassName} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" role="menuitem" className={itemClassName} onClick={handleClick}>
      {children}
    </button>
  );
}

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

export default Dropdown;
