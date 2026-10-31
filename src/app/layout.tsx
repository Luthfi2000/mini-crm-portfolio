import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini CRM | Enterprise Sales & Pipeline Management",
  description: "A high-performance modern CRM with interactive Kanban pipeline, contact directory, activity timeline, and executive sales intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',-apple-system,BlinkMacSystemFont,sans-serif]">
        {children}
      </body>
    </html>
  );
}
