import { Controller, Get, HttpException, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IRequestOauthUser } from '../interfaces/request-oauth-user.interface';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthCallback(@Req() req: IRequestOauthUser, @Res() res: Response) {
    try {
      const user = req.user;
			return res.redirect(`${process.env.FRONT_URL}/auth/callback?jwtToken=${user.jwtToken}&id=${user.id}&twoFactorAuth=${user.twoFactorAuth}`);
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
	async googleAuthCallback(@Req() req: IRequestOauthUser, @Res() res: Response) {
    try {
      const user = req.user;
			return res.redirect(`${process.env.FRONT_URL}/auth/callback?jwtToken=${user.jwtToken}&id=${user.id}&twoFactorAuth=${user.twoFactorAuth}`);
    } catch (error) {
      console.error('auth.controller.ts/google:', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get('callback')
  @UseGuards(AuthGuard('jwt'))
  status(@Req() req: Request): object {
    return req.user;
  }
}
