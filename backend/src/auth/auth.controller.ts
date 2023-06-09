import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthCallback(@Req() req: RequestWithUser) {
    try {
      const user = req.user;
      return { user };
    } catch (error) {
      console.error('auth.controller.ts:', error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  status(@Req() req: Request): object {
    return req.user;
  }
}
