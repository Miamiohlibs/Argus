'use client';

import { ReactNode, useState } from 'react';
import { List } from 'react-bootstrap-icons';

export default function HeaderNav({
  navBgClass,
  brand,
  children,
}: {
  navBgClass: string;
  brand: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`${navBgClass} px-2 py-2`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:flex-nowrap">
        <button
          type="button"
          aria-controls="navbar"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded border border-white/50 p-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 md:hidden"
        >
          <List size={22} aria-hidden="true" />
        </button>
        {brand}
        <div
          id="navbar"
          className={`${open ? 'flex' : 'hidden'} w-full flex-col items-start gap-2 md:ms-auto md:flex md:w-auto md:flex-row md:items-center md:gap-3`}
        >
          {children}
        </div>
      </div>
    </header>
  );
}
