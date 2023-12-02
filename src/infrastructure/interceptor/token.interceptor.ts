import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Response } from 'express';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { User } from 'domain/models/User';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadData } from 'infrastructure/guards/JwtStrategy';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<SuccessResponseDTO> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();

        const secretKey = this.configService.get('SECRET_KEY');

        const payloadData: JwtPayloadData = { userId: user.id };
        const payload = {
          sub: payloadData,
        };

        const token = this.authUseCase.signToken(payload, {
          secret: secretKey,
          expiresIn: '1d',
        });

        response.setHeader('Authorization', `Bearer ${token}`);
        response.cookie('token', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: this.configService.get('NODE_ENV') === 'production',
        });

        return new SuccessResponseDTO({
          message: 'User logged in successfully',
          metadata: { token: token },
        });
      }),
    );
  }
}
