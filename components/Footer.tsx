import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-1 bg-light text-center">
      <p>
        <Link href="https://github.com/Miamiohlibs/Argus">Argus</Link> version{' '}
        {process.env.APP_VERSION} <span className="mx-3">|</span> © 2026 Miami
        University Libraries
      </p>
    </footer>
  );
};
export default Footer;
