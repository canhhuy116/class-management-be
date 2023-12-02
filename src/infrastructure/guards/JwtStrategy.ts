import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';

export interface JwtPayloadData {
  userId: number;
}

export interface JwtPayload {
  sub: JwtPayloadData;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayloadData;
}

const extractJwtFromCookie: JwtFromRequestFunction = (request) => {
  return request.signedCookies['token']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub.userId;
    await this.authUseCase.verifyPayload(userId);

    return payload.sub;
  }
}
