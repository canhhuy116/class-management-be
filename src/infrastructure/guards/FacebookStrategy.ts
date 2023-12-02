import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUseCase } from 'application/usecases/AuthUseCase';
import { User } from 'domain/models/User';
import { Profile, Strategy } from 'passport-facebook';

export interface RequestWithFullUser extends Request {
  user: User;
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `http://${configService.get('HOST')}:${configService.get(
        'PORT',
      )}/api/v1/auth/facebook/callback`,
      passReqToCallback: true,
      scope: ['email', 'public_profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, displayName } = profile;
    const fakeEmail = `${profile.id}@facebook.com`;
    profile.emails = [{ value: fakeEmail }];

    const facebookUser = new User(
      displayName,
      fakeEmail,
      null,
      null,
      null,
      null,
      id,
    );

    const user = await this.authUseCase.loginOauth2(facebookUser);

    return done(null, user);
  }
}
