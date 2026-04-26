export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class FileSizeError extends AppError {
  constructor(message: string = 'File size exceeds limit') {
    super(message);
  }
}

export class InvalidFileTypeError extends AppError {
  constructor(message: string = 'Invalid file type') {
    super(message);
  }
}

export class PDFParseError extends AppError {
  constructor(message: string = 'Failed to parse PDF') {
    super(message);
  }
}

export class GroqAPIError extends AppError {
  constructor(message: string = 'Groq API error') {
    super(message);
  }
}
