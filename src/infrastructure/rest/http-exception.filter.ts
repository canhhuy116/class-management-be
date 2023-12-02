import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from 'domain/exceptions/DomainException';

/**
 * Http Error Filter.
 * Gets an HttpException or DomainException in code and creates an error response
 */
@Catch(HttpException, DomainException)
export class HttpExceptionFilter
  implements ExceptionFilter<HttpException | DomainException>
{
  catch(exception: HttpException | DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode: number;
    let exceptionResponse: any;
    let jsonResponse: any = {
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      exceptionResponse = exception.getResponse();

      if (statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
        jsonResponse.message = exception.message;
      } else {
        jsonResponse.error = exceptionResponse.message;
      }
    } else if (exception instanceof DomainException) {
      statusCode = HttpStatus.BAD_REQUEST;
      jsonResponse.message = exception.message;
    }

    response.status(statusCode).json(jsonResponse);
  }
}
