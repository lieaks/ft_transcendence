import { Request } from 'express';
import { User } from '@prisma/client';

export interface IRequestUser extends Request {
  user: User;
}
