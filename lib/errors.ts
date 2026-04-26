export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class FileSizeError extends AppError {
  constructor(message: string = 'File size exceeds limit') {
    super(message, 'FILE_SIZE_ERROR', 413);
  }
}

export class InvalidFileTypeError extends AppError {
  constructor(message: string = 'Invalid file type') {
    super(message, 'INVALID_FILE_TYPE', 400);
  }
}

export class PDFParseError extends AppError {
  constructor(message: string = 'Failed to parse PDF') {
    super(message, 'PDF_PARSE_ERROR', 500);
  }
}

export class GroqAPIError extends AppError {
  constructor(message: string = 'Groq API error') {
    super(message, 'GROQ_API_ERROR', 500);
  }
}
