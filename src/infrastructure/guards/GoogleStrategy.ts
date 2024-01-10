import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { User } from 'domain/models/User';
import { Profile, Strategy } from 'passport-google-oauth20';

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
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, displayName, emails } = profile;

    const googleUser = new User(displayName, emails[0].value, null);

    googleUser.withGoogleId(id);

    const user = await this.authUseCase.loginOauth2(googleUser);

    return done(null, user);
  }
}
