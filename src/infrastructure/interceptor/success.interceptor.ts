import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SuccessInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof SuccessResponseDTO) {
          const response = context.switchToHttp().getResponse<Response>();

          response.status(data.status);

          this.logger.log(
            `Response: ${JSON.stringify(data)}`,
            'SuccessInterceptor',
          );

          return {
            message: data.message,
            status: data.status,
            metadata: data.metadata,
          };
        }

        return data;
      }),
    );
  }
}
