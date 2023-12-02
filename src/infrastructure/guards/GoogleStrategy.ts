import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { User } from 'domain/models/User';
import { Strategy } from 'passport-google-oauth20';

export interface RequestWithFullUser extends Request {
  user: User;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `http://${configService.get('HOST')}:${configService.get(
        'PORT',
      )}/api/v1/auth/google/callback`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user = await this.authUseCase.loginByGoogle(profile);

    return done(null, user);
  }
}
