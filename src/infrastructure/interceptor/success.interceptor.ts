import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { SuccessResponse } from 'core/SuccessResponse';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof SuccessResponse) {
          const response = context.switchToHttp().getResponse<Response>();

          response.status(data.status);

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
