import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-2 bg-light">
      <div className="container">
        <div className="footer-meta">
          <div>
            <Link href="https://github.com/Miamiohlibs/Argus">Argus</Link>{' '}
            <span className="text-muted">
              version {process.env.APP_VERSION}
            </span>
          </div>

          <div>
            <Link href="/about">About</Link>
          </div>

          <div className="text-muted">© 2026 Miami University Libraries</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
