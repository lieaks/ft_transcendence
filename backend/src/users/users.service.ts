import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: IUser[] = [];
  addUser(user: IUser) {
    this.users.push(user);
  }
  removeUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
  getUser(id: string) {
    this.users.find((u) => u.id === id);
  }
  requireTwoFactor(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (user) user.twoFactorNeeded = true;
  }
  removeTwoFactor(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (user) user.twoFactorNeeded = false;
  }
}
