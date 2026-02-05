import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-1 bg-light text-center">
      <p>
        © 2026 <Link href="https://github.com/Miamiohlibs/Argus">Argus</Link>{' '}
        version {process.env.APP_VERSION}
      </p>
    </footer>
  );
};
export default Footer;
