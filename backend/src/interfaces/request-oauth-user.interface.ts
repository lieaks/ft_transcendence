import { Request } from 'express';

export interface IRequestOauthUser extends Request {
  id: string;
  name: string;
  jwtToken: string;
}
