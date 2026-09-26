export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any[];

  constructor(statusCode: number, message: string, code = 'API_ERROR', details: any[] = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
