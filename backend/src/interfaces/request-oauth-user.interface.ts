import { Request } from 'express';

export interface IRequestOauthUser extends Request {
  id: string;
  twoFactorAuth: boolean;
  jwtToken: string;
}
