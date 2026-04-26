export class AppError extends Error {
  constructor(
    message: string,
    // FIX #2: Removed unused 'code' parameter - it was never used
    // FIX #3: Removed unused 'statusCode' parameter - it was never used
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class FileSizeError extends AppError {
  constructor(message: string = 'File size exceeds limit') {
    // FIX #2, #3: Removed code and statusCode arguments since they were unused
    super(message);
  }
}

export class InvalidFileTypeError extends AppError {
  constructor(message: string = 'Invalid file type') {
    // FIX #2, #3: Removed code and statusCode arguments since they were unused
    super(message);
  }
}

export class PDFParseError extends AppError {
  constructor(message: string = 'Failed to parse PDF') {
    // FIX #2, #3: Removed code and statusCode arguments since they were unused
    super(message);
  }
}

export class GroqAPIError extends AppError {
  constructor(message: string = 'Groq API error') {
    // FIX #2, #3: Removed code and statusCode arguments since they were unused
    super(message);
  }
}
