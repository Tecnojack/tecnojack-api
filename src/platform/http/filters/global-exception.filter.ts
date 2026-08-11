import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  requestId: string;
  timestamp: string;
  errors?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const details = this.resolveDetails(status, exceptionResponse);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl} failed`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const problem: ProblemDetails = {
      type: `https://api.tecnojack.com/problems/${details.type}`,
      title: details.title,
      status,
      detail: details.detail,
      instance: request.originalUrl,
      requestId: request.requestId ?? 'unavailable',
      timestamp: new Date().toISOString(),
      ...(details.errors === undefined ? {} : { errors: details.errors }),
    };

    response.status(status).type('application/problem+json').json(problem);
  }

  private resolveDetails(
    status: number,
    response: string | object | undefined,
  ): { type: string; title: string; detail: string; errors?: unknown } {
    const fallbackTitle = HttpStatus[status] ?? 'Error';

    if (typeof response === 'string') {
      return { type: 'http-error', title: fallbackTitle, detail: response };
    }

    if (response && typeof response === 'object') {
      const body = response as Record<string, unknown>;
      const message = body.message;
      const isValidationError = Array.isArray(message);
      return {
        type: isValidationError ? 'validation-error' : 'http-error',
        title: typeof body.error === 'string' ? body.error : fallbackTitle,
        detail: isValidationError
          ? 'One or more fields are invalid.'
          : typeof message === 'string'
            ? message
            : fallbackTitle,
        ...(isValidationError ? { errors: message } : {}),
      };
    }

    return {
      type: 'internal-server-error',
      title: 'Internal Server Error',
      detail: 'An unexpected error occurred.',
    };
  }
}
