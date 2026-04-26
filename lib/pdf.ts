import pdfParse from 'pdf-parse';
import { PdfParseError } from './errors';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // FIX #8: Limit pages to prevent memory issues in serverless environments
    const data = await pdfParse(buffer, {
      max: 50, // Limit to 50 pages for serverless compatibility
    });

    // FIX #9: Remove redundant check, single validation is sufficient
    if (!data.text || data.text.trim().length === 0) {
      throw new PdfParseError('No text content found in PDF');
    }

    return data.text.trim();
  } catch (error) {
    if (error instanceof PdfParseError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new PdfParseError('Invalid or corrupted PDF file');
      }
      throw new PdfParseError(`PDF parsing failed: ${error.message}`);
    }

    throw new PdfParseError('Unknown error while parsing PDF');
  }
}
