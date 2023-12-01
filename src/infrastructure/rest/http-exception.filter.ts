import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Http Error Filter.
 * Gets an HttpException in code and creates an error response
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let jsonResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
      jsonResponse.message = exception.message;
    } else {
      jsonResponse.error = exceptionResponse.message;
    }

    response.status(statusCode).json(jsonResponse);
  }
}
