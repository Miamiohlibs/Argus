import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles/custom-bootstrap.scss';
import '@/app/styles/custom-bootstrap.scss';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Argus',
  description: 'Special Collections Pull List Manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className}`}>
          <div id="skiplink" className="visually-hidden-focusable">
            <a href="#main-content">Skip to Main Content</a>
          </div>
          <Header />
          <main className="container-fluid px-4 py-3" id="main-content">
            {children}
          </main>
          <ToastContainer />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
