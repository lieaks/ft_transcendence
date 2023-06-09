import { Request } from 'express';
import { User } from './user.interface'; // Replace with the path to your User entity

export interface RequestWithUser extends Request {
  user: User;
}
