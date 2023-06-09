import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user.interface';
import * as fs from 'fs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private default_avatar: Buffer;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
    try {
      console.log('google profile:', profile);
      let user: User = await this.prismaService.user.findFirst({
        where: {
          oauthProvider: profile.provider,
          oauthId: profile.id as string,
        },
      });
      if (!user) {
        const userwithname = await this.prismaService.user.findFirst({
          where: { name: profile.displayName },
        });
        const name = userwithname
          ? `${profile.displayName}g${profile.id}`
          : profile.displayName;

        user = await this.prismaService.user.create({
          data: {
            name,
            oauthProvider: profile.provider,
            oauthId: profile.id,
            avatar: this.default_avatar,
          },
        });
      }
      user.jwtToken = await this.authService.generateJwtToken(user);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
