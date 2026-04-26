# DeepPDF Analyzer

A production-ready Next.js application that analyzes PDF documents using AI-powered insights. Built with Groq's Llama 3.1-70B-Versatile model for fast, intelligent document analysis.

## Features

- **Premium Dark Theme**: High-contrast UI with glass-morphism effects and gold accents
- **PDF Upload**: Drag-and-drop file upload with validation (PDF only, max 10MB)
- **AI Analysis**: Extracts text from PDFs and generates:
  - A sharp, one-sentence summary
  - 3 key insights
  - 5 actionable items
- **Edge Functions**: Optimized for Vercel Edge deployment
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom premium dark theme
- **Icons**: Lucide-React
- **File Upload**: react-dropzone
- **PDF Processing**: pdf-parse (server-side)
- **AI Engine**: Groq SDK with Llama 3.1-70B-Versatile
- **Deployment**: Vercel Edge Functions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Groq API key ([get one here](https://console.groq.com/))

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your Groq API key to `.env.local`:
```
GROQ_API_KEY=your_groq_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `GROQ_API_KEY` as an environment variable in Vercel settings
4. Deploy

The application is configured for Vercel Edge Functions for optimal performance.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # API endpoint for PDF analysis
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page with user flow
├── components/
│   ├── AnalysisLoading.tsx  # Loading spinner component
│   ├── FileUpload.tsx       # Drag-and-drop file upload
│   └── ResultsCard.tsx      # Results display with shimmer effect
├── lib/
│   ├── errors.ts            # Custom error classes
│   ├── groq.ts              # Groq SDK integration
│   ├── i18n.ts              # Utility functions
│   └── pdf.ts               # PDF parsing utilities
├── types/
│   └── index.ts             # TypeScript type definitions
└── public/                  # Static assets
```

## API Endpoint

### POST /api/analyze

Analyzes a PDF document and returns AI-generated insights.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with `file` field (PDF)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "One-sentence summary",
    "insights": [
      "Key insight 1",
      "Key insight 2",
      "Key insight 3"
    ],
    "actionItems": [
      "Action item 1",
      "Action item 2",
      "Action item 3",
      "Action item 4",
      "Action item 5"
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Error Handling

The application includes robust error handling for:
- File size limits (10MB max)
- Invalid file types (PDF only)
- PDF parsing failures
- Groq API errors
- Network timeouts

## Performance

- Edge Functions for fast response times
- File size limits to prevent memory issues
- Optimized PDF parsing
- Efficient API calls with timeouts

## License

MIT

## Acknowledgments

- Powered by [Groq](https://groq.com/) and Llama 3.1-70B-Versatile
- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
