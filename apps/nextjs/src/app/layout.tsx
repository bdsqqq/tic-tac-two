import 'react-image-crop/dist/ReactCrop.css';
import '~/styles/globals.css';

import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

import { cn } from '@haxiom/ui';
import { Toaster } from '@haxiom/ui/toaster';

import { TailwindIndicator } from '~/components/tailwind-indicator';
import { ThemeProvider } from '~/components/theme-provider';
import { siteConfig } from './config';
import { TooltipProvider } from '@haxiom/ui/tooltip';

const fontSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['200', '400', '700'],
});
const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['200', '400', '700'],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: 'https://haxiom-nextjs.vercel.app/opengraph-image.png' }],
    creator: '@bedesqui',
  },
  metadataBase: new URL('https://haxiom-nextjs.vercel.app/'),
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg">
      <body className={cn('min-h-screen font-sans antialiased', fontSans.variable, fontMono.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            {props.children}
            <TailwindIndicator />
          </TooltipProvider>
        </ThemeProvider>
        {/* <Analytics /> */}
        <Toaster />
      </body>
    </html>
  );
}
