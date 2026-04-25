# PDF Analyzer - AI Document Insights

A production-ready Next.js application that transforms PDF documents into actionable insights using Groq's high-speed AI inference.

## Features

- **Premium Dark UI** - High-contrast design with gold (#D4AF37) accents
- **Glass-morphism Dropzone** - Modern drag-and-drop file upload with shimmer effects
- **AI-Powered Analysis** - Groq SDK integration with llama-3.1-70b-versatile model
- **Structured Results** - Summary, 3 key insights, and 5 action items
- **Edge Runtime** - Optimized for Vercel Edge Functions
- **Robust Error Handling** - File validation, size limits, and API timeout handling

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React
- **PDF Parsing**: pdf-parse
- **AI Engine**: Groq SDK
- **File Upload**: react-dropzone
- **Runtime**: Edge Functions

## Getting Started

### Prerequisites

- Node.js 18+
- A Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: Navigate to `http://localhost:3000`

## Usage

1. Drag and drop a PDF file into the upload zone (max 10MB)
2. Wait for the AI analysis to complete
3. View the structured results: summary, key insights, and action items
4. Click "Copy to Clipboard" to save the results

## API Endpoint

### POST `/api/analyze`

Analyzes a PDF document and returns structured insights.

**Request**: `multipart/form-data` with a `file` field containing the PDF

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": "One-sentence summary",
    "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
    "actionItems": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]
  }
}
```

## Project Structure

```
├── app/
│   ├── api/analyze/      # API route for PDF analysis
│   ├── globals.css       # Global styles & Tailwind
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/
│   ├── FileUpload.tsx    # Glass-morphism dropzone
│   ├── AnalysisLoading.tsx # Loading spinner
│   └── ResultsCard.tsx   # Results display with shimmer
├── lib/
│   ├── errors.ts         # Error handling classes
│   ├── groq.ts          # Groq SDK integration
│   ├── pdf.ts           # PDF text extraction
│   └── utils.ts         # Utility functions
├── types/
│   └── index.ts         # TypeScript interfaces
├── package.json
├── tailwind.config.ts   # Custom theme configuration
└── next.config.js       # Next.js configuration
```

## Configuration

### Customizing Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  background: '#121212',  // Main background
  primary: '#D4AF37',      // Gold accent
  text: '#EDEDED',         // Primary text
  surface: '#1E1E1E',      // Card backgrounds
}
```

### Changing Model

Edit `lib/groq.ts`:

```typescript
const MODEL = 'llama-3.1-70b-versatile'; // Change to your preferred model
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add `GROQ_API_KEY` to environment variables
4. Deploy

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes |

## Error Handling

The application handles these error scenarios:

- **File Validation**: Invalid file types, size limits
- **PDF Parsing**: Corrupted or scanned PDFs
- **API Errors**: Rate limits, timeouts, invalid responses
- **Network Issues**: Connection failures

## License

MIT
