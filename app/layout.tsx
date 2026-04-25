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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text y='13' font-size='13'>📄</text></svg>" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
