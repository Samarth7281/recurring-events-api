import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { LoggerService } from '../logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { status, message } = this.handleException(exception);
    
    // Log the error details
    this.logger.error(`HTTP ${status} Error: ${message}`);

    // Send the response back to the client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private handleException(exception: unknown): { status: number; message: string } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      return this.handleDatabaseError(exception);
    } else {
      return this.handleUnknownError(exception);
    }
  }

  private handleHttpException(exception: HttpException): { status: number; message: string } {
    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    const message = this.extractMessage(responseBody);

    return { status, message };
  }

  private handleDatabaseError(exception: QueryFailedError): { status: number; message: string } {
    const status = HttpStatus.BAD_REQUEST;
    const message = `Database error: ${exception.message}`;
    
    return { status, message };
  }

  private handleUnknownError(exception: unknown): { status: number; message: string } {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Internal server error';
    
    return { status, message };
  }

  private extractMessage(responseBody: unknown): string {
    if (typeof responseBody === 'string') {
      return responseBody; // Directly return if it's a string
    } else if (typeof responseBody === 'object' && responseBody !== null) {
      // If it's an object, extract the message property if it exists
      return (responseBody as { message?: string }).message || 'An error occurred';
    }
    return 'An unexpected error occurred'; // Fallback message
  }
}
