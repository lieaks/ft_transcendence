import {
  Controller,
  Get,
  HttpException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IRequestOauthUser } from '../interfaces/request-oauth-user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyAuthCallback(@Req() req: IRequestOauthUser, @Res() res: Response) {
    try {
      let referer =
        req.headers.referer ||
        req.headers.referrer ||
        process.env.DEFAULT_FRONTEND_URL;
      if (referer[referer.length - 1] !== '/') referer += '/';
      const user = req.user;
      const twoFactorAuth = await this.AuthService.isTokenRequireTwoFactor(
        user.jwtToken,
      );
      return res.redirect(
        `${referer}auth/callback?jwtToken=${user.jwtToken}&id=${user.id}&twoFactorAuth=${twoFactorAuth}`,
      );
    } catch (error) {
      console.error('auth.controller.ts/42:', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: IRequestOauthUser,
    @Res() res: Response,
  ) {
    try {
      let referer =
        req.headers.referer ||
        req.headers.referrer ||
        process.env.DEFAULT_FRONTEND_URL;
      if (referer[referer.length - 1] !== '/') referer += '/';
      const user = req.user;
      const twoFactorAuth = await this.AuthService.isTokenRequireTwoFactor(
        user.jwtToken,
      );
      return res.redirect(
        `${referer}auth/callback?jwtToken=${user.jwtToken}&id=${user.id}&twoFactorAuth=${twoFactorAuth}`,
      );
    } catch (error) {
      console.error('auth.controller.ts/google:', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
