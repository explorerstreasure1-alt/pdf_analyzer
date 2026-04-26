import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/pdf';
import { analyzeTextWithGroq } from '@/lib/groq';
import { handleError, FileValidationError, PdfParseError, ApiError } from '@/lib/errors';
import { AnalysisResponse } from '@/types';

// Force Node.js runtime for pdf-parse compatibility
export const runtime = 'nodejs';

// FIX #4: Vercel Hobby tier has 10s timeout, Pro tier has 60s
// Using 10s to ensure compatibility with free tier
export const maxDuration = 10;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResponse>> {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      throw new FileValidationError('No file provided');
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new FileValidationError('Only PDF files are supported');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new FileValidationError(`File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
    }

    // Convert file to buffer
    // FIX #5: Add error handling for arrayBuffer conversion
    let bytes: ArrayBuffer;
    try {
      bytes = await file.arrayBuffer();
    } catch (error) {
      throw new FileValidationError('Failed to read file data');
    }
    const buffer = Buffer.from(bytes);

    // Check if buffer is valid PDF (starts with %PDF)
    const header = buffer.slice(0, 5).toString('ascii');
    if (!header.startsWith('%PDF')) {
      throw new FileValidationError('Invalid PDF file format');
    }

    // Extract text from PDF
    let text: string;
    try {
      text = await extractTextFromPdf(buffer);
    } catch (error) {
      if (error instanceof PdfParseError) {
        throw error;
      }
      throw new PdfParseError('Failed to extract text from PDF');
    }

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      throw new PdfParseError('No text content found in PDF');
    }

    if (text.length < 50) {
      throw new PdfParseError('PDF contains insufficient text for analysis (minimum 50 characters)');
    }

    // Analyze with Groq
    let result;
    try {
      result = await analyzeTextWithGroq(text);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('AI analysis failed. Please try again later.', 500);
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 200 });

  } catch (error) {
    const { message, code, statusCode } = handleError(error);

    return NextResponse.json({
      success: false,
      error: {
        message,
        code,
      },
    }, { status: statusCode });
  }
}
