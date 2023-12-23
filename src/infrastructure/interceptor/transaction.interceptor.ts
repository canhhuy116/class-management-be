import {
  Injectable,
  NestInterceptor,
  Logger,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { Connection } from 'typeorm';

@Injectable()
export class PreTransactionInterceptor implements NestInterceptor {
  constructor(private readonly connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req.queryRunner = queryRunner;

    return next.handle();
  }
}

@Injectable()
export class PostTransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PostTransactionInterceptor.name);

  constructor(private readonly connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    return next.handle().pipe(
      tap(() => {
        const queryRunner = req.queryRunner;
        if (queryRunner) {
          queryRunner
            .commitTransaction()
            .catch((e: Error) =>
              this.logger.error(
                `Could not commit transaction: ${e.toString()}`,
              ),
            )
            .finally(() => {
              queryRunner
                .release()
                .catch((e: Error) =>
                  this.logger.error(
                    `Could not release connection: ${e.toString()}`,
                  ),
                );
            });
        }
      }),
      catchError((e) => {
        const queryRunner = req.queryRunner;
        if (queryRunner) {
          queryRunner
            .rollbackTransaction()
            .catch((rollbackError: Error) =>
              this.logger.error(
                `Could not rollback transaction: ${rollbackError.toString()}`,
              ),
            )
            .finally(() => {
              queryRunner
                .release()
                .catch((e: Error) =>
                  this.logger.error(
                    `Could not release connection: ${e.toString()}`,
                  ),
                );
            });
        }
        return throwError(e);
      }),
    );
  }
}
