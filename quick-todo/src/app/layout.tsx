import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Quick Todo',
  description: 'A frictionless, no-login todo app for quick task management',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <a href='#main' className='skip-link'>
          Skip to main content
        </a>
        <main id='main'>{children}</main>
      </body>
    </html>
  );
}