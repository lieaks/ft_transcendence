import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import * as fs from 'fs';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  private default_avatar: Buffer;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
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
      console.log('42 profile:', profile);
      let user = await this.prismaService.user.findFirst({
        where: {
          oauthProvider: profile.provider,
          oauthId: profile.id as string,
        },
      });
      if (!user) {
        const userwithname = await this.prismaService.user.findFirst({
          where: { name: profile.username },
        });
        const name = userwithname
          ? `${profile.username}${profile.provider}${profile.id}`
          : profile.username;

        user = await this.prismaService.user.create({
          data: {
            name,
            oauthProvider: profile.provider,
            oauthId: profile.id,
            avatar: this.default_avatar,
          },
        });
      }
      const jwtToken = await this.authService.generateJwtToken(user);
      done(null, { id: user.id, name: user.name, jwtToken });
    } catch (error) {
      done(error, null);
    }
  }
}
