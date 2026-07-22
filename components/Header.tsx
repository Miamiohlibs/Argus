import NextLink from 'next/link';
import Image from 'next/image';
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import { Search } from 'react-bootstrap-icons';
import { checkUser } from '@/lib/checkUser';
import NavEditor from './NavEditor';
import NavAdmin from './NavAdmin';
import HeaderNav from './HeaderNav';
import { NAV_LINK_CLASS } from './navLinkStyles';
import { buttonClasses } from './ui/Button';

const NAV_BG_CLASSES: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
  light: 'bg-light',
  dark: 'bg-dark',
};

const Header = async () => {
  const user = await checkUser();
  const navBgClass =
    NAV_BG_CLASSES[process.env.NEXT_PUBLIC_NAV_COLOR ?? 'dark'] ?? NAV_BG_CLASSES.dark;

  const brand = (
    <NextLink href="/" className={`flex items-center ${NAV_LINK_CLASS}`}>
      <Image
        src={`${process.env.NEXT_PUBLIC_APP_BASEPATH}/peacock-logo.png`}
        alt="Peacock Logo"
        width={40}
        height={40}
      />
      <span className="ps-2 text-lg">
        Argus {process.env.NEXT_PUBLIC_NAV_LABEL || ''}
      </span>
    </NextLink>
  );

  return (
    <HeaderNav navBgClass={navBgClass} brand={brand}>
      <NavEditor />
      <Show when="signed-in">
        <NextLink href="/publicProjects" className={NAV_LINK_CLASS}>
          Public Projects
        </NextLink>
      </Show>
      <NavAdmin />
      <Show when="signed-in">
        <NextLink href="/searchEntries" className={`flex items-center gap-1 ${NAV_LINK_CLASS}`}>
          <Search aria-hidden="true" /> Search
        </NextLink>
      </Show>
      <Show when="signed-out">
        <SignInButton>
          <div className={buttonClasses({ variant: 'light' })}>Sign in</div>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-4">
          {user?.name && <span className="text-white">{user?.name}</span>}
          <UserButton />
        </div>
      </Show>
    </HeaderNav>
  );
};

export default Header;
