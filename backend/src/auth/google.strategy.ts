import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private default_avatar: Buffer;

  constructor(
    private readonly PrismaService: PrismaService,
    private readonly AuthService: AuthService,
    private readonly UsersService: UsersService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL + '/auth/google/callback',
      scope: ['profile'],
    });
    this.default_avatar = fs.readFileSync('./src/assets/default_avatar.png');
    if (!this.default_avatar) {
      throw new Error('Failed to load default avatar');
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
		// console.log('google profile', profile);
    try {
      let user = await this.PrismaService.user.findFirst({
        where: {
          oauthProvider: profile.provider,
          oauthId: profile.id as string,
        },
      });
      if (!user) {
        const userwithname = await this.PrismaService.user.findFirst({
          where: { name: profile.displayName },
        });
        const name = userwithname
          ? `${profile.displayName}${profile.provider}${profile.id}`
          : profile.displayName;

        user = await this.PrismaService.user.create({
          data: {
            name,
            oauthProvider: profile.provider,
            oauthId: profile.id,
            avatar: this.default_avatar,
          },
        });
      }
      const jwtToken = await this.AuthService.generateJwtToken(user);
      if (user.twoFactorSecret) {
        this.AuthService.addRequireTwoFactor(jwtToken, user.id);
      }
      done(null, {
        id: user.id,
        twoFactorAuth: Boolean(user.twoFactorSecret),
        jwtToken,
      });
    } catch (error) {
      done(error, null);
    }
  }
}
