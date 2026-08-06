import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mt-auto bg-light py-2 print:hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="footer-meta">
          <div>
            <Link href="https://github.com/Miamiohlibs/Argus">Argus</Link>{' '}
            <span className="text-gray-500">
              version {process.env.APP_VERSION}
            </span>
          </div>

          <div>
            <Link href="/about">About</Link>
          </div>

          <div className="text-gray-500">© 2026 Miami University Libraries</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
