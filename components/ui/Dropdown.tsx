'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ButtonSize, ButtonVariant, buttonClasses } from './Button';

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideContainer = containerRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);
      if (!insideContainer && !insideMenu) {
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
    <DropdownContext.Provider value={{ open, setOpen, toggleRef, menuRef }}>
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
  const { open, toggleRef, menuRef } = useDropdownContext();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const toggleEl = toggleRef.current;
      const menuEl = menuRef.current;
      if (!toggleEl) return;
      const rect = toggleEl.getBoundingClientRect();
      const menuWidth = menuEl?.offsetWidth ?? 0;
      setPosition({
        top: rect.bottom + 4,
        left: align === 'end' ? rect.right - menuWidth : rect.left,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, align, toggleRef, menuRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      style={position ? { top: position.top, left: position.left } : undefined}
      className={`fixed z-50 min-w-40 rounded border border-gray-200 bg-white py-1 shadow-lg print:hidden ${position ? '' : 'invisible'} ${className}`}
    >
      {children}
    </div>,
    document.body,
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
