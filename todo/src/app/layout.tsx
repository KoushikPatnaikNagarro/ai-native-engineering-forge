import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick Todo - Simple Task Management",
  description: "A frictionless, no-login task management tool for capturing and managing quick reminders and tasks. Session-based storage, instant task capture, and effortless management.",
  keywords: ["todo", "task management", "productivity", "reminders", "notes", "session storage"],
  authors: [{ name: "Quick Todo App" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#0904a3",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Quick Todo - Simple Task Management",
    description: "A frictionless, no-login task management tool for capturing and managing quick reminders and tasks.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-[Mulish] antialiased">
        {children}
      </body>
    </html>
  );
}
