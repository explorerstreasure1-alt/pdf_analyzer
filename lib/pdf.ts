import pdfParse from 'pdf-parse';
import { PDFParseError } from './errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new PDFParseError('Failed to extract text from PDF');
  }
}

export function validatePDFFile(file: File): boolean {
  const validTypes = ['application/pdf'];
  return validTypes.includes(file.type);
}

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}
