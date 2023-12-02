import { Injectable } from '@nestjs/common';
import { SignOptions, VerifyOptions } from 'jsonwebtoken';

@Injectable()
export abstract class IJwtService {
  abstract sign(
    secretKey: string,
    payload: string | object | Buffer,
    options?: SignOptions,
  ): string;

  abstract verify<T extends object = any>(
    secretKey: string,
    token: string,
    options?: VerifyOptions,
  ): T;

  abstract decode<T extends object = any>(token: string): T | null;
}
