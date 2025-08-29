// app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from './Provider';
import PayPalWrapper from './PayPalWrapper';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Craving Cart',
  description: 'Delicious food ordering app made with Clerk & Next.js 15',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <PayPalWrapper>
          <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Provider>{children}</Provider>
            </ThemeProvider>
          </body>
        </PayPalWrapper>
      </html>
    </ClerkProvider>
  );
}
