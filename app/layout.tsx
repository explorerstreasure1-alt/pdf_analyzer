import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PDF Analyzer - AI Document Insights',
  description: 'Transform your PDFs into actionable insights with Groq-powered AI analysis. Get summaries, key insights, and action items instantly.',
  keywords: ['PDF', 'AI', 'analysis', 'Groq', 'document', 'insights'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext x='0' y='12' font-family='Arial' font-size='12'%3EPDF%3C/text%3E%3C/svg%3E" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
