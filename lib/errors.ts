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

export class FileValidationError extends AppError {
  constructor(message: string) {
    super(message, 'FILE_VALIDATION_ERROR', 400);
    this.name = 'FileValidationError';
  }
}

export class PdfParseError extends AppError {
  constructor(message: string = 'Failed to parse PDF') {
    super(message, 'PDF_PARSE_ERROR', 422);
    this.name = 'PdfParseError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'API_ERROR', statusCode);
    this.name = 'ApiError';
  }
}

export class GroqError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'GROQ_ERROR', statusCode);
    this.name = 'GroqError';
  }
}

export function handleError(error: unknown): { message: string; code: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}
