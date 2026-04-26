import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, validatePDFFile, validateFileSize } from '@/lib/pdf';
import { analyzePDFText } from '@/lib/groq';
import { AnalysisResponse, AnalysisResult } from '@/types';
import { FileSizeError, InvalidFileTypeError, PDFParseError, GroqAPIError } from '@/lib/errors';
import { defaultRateLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { withRetry } from '@/lib/retry';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Note: Environment variables are validated at runtime when Groq client is initialized

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Check rate limit
  const rateLimitResult = defaultRateLimiter.check(ip);
  if (!rateLimitResult.allowed) {
    logger.warn('Rate limit exceeded', { ip });
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' } as AnalysisResponse,
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  try {
    logger.info('Starting PDF analysis', { ip });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' } as AnalysisResponse,
        { status: 400 }
      );
    }

    // Validate file type
    if (!validatePDFFile(file)) {
      throw new InvalidFileTypeError('Only PDF files are allowed');
    }

    // Validate file size
    if (!validateFileSize(file)) {
      throw new FileSizeError('File size exceeds 10MB limit');
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    if (!text || text.trim().length === 0) {
      throw new PDFParseError('No text could be extracted from the PDF');
    }

    // Analyze text with Groq with retry logic
    const analysis = await withRetry(
      () => analyzePDFText(text),
      {
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
      }
    );

    // Validate response structure
    if (!analysis.summary || !analysis.insights || !analysis.actionItems) {
      throw new GroqAPIError('Invalid response from AI analysis');
    }

    const result: AnalysisResult = {
      summary: analysis.summary,
      insights: analysis.insights,
      actionItems: analysis.actionItems,
    };

    logger.info('PDF analysis completed successfully', { ip, fileName: file.name });

    return NextResponse.json(
      { success: true, data: result } as AnalysisResponse,
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Analysis error', error instanceof Error ? error : new Error(errorMessage), { ip });

    if (error instanceof FileSizeError) {
      return NextResponse.json(
        { success: false, error: error.message } as AnalysisResponse,
        { status: 413 }
      );
    }

    if (error instanceof InvalidFileTypeError) {
      return NextResponse.json(
        { success: false, error: error.message } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (error instanceof PDFParseError || error instanceof GroqAPIError) {
      return NextResponse.json(
        { success: false, error: error.message } as AnalysisResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' } as AnalysisResponse,
      {
        status: 500,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        }
      }
    );
  }
}
