import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RouteLoader from "./components/RouteLoader";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Abhibhi SaaS Solutions',
  description: 'Building Scalable SaaS & AI Solutions for Modern Businesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-yellow-50 text-black font-sans antialiased min-h-screen flex flex-col selection:bg-black selection:text-white" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <RouteLoader />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

