import { Injectable } from '@nestjs/common';
import { IJwtService } from 'application/ports/IJwtService';
import { SignOptions, VerifyOptions, decode, sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService implements IJwtService {
  sign(
    secretKey: string,
    payload: string | object | Buffer,
    options?: SignOptions,
  ): string {
    return sign(payload, secretKey, options);
  }

  verify<T extends object = any>(
    secretKey: string,
    token: string,
    options?: VerifyOptions,
  ): T {
    return verify(token, secretKey, options) as T;
  }

  decode<T extends object = any>(token: string): T | null {
    return decode(token) as T | null;
  }
}
