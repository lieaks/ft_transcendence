import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { User } from './user';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private users: IUser[] = [];

  addUser(user: IUser) {
    console.log('adding user: ', user.id);
    if (this.getUser(user.id)) return;
    this.users.push(user);
    console.log(
      'users stored: ',
      this.users.map((u) => u.id),
    );
    return user;
  }
  removeUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
  getUser(id: string) {
    console.log(
      'users stored: ',
      this.users.map((u) => u.id),
    );
    return this.users.find((u) => u.id === id);
  }
  requireTwoFactor(id: string) {
    let user = this.getUser(id);
    if (user) user.twoFactorNeeded = true;
    else {
      console.log(
        'user not found, creating new user to set two factor with id ',
        id,
      );
      user = new User(this.prismaService, id);
      console.log('user created: ', user.id);
      user.twoFactorNeeded = true;
      this.addUser(user);
    }
  }
  removeTwoFactor(id: string) {
    const user = this.getUser(id);
    if (user) user.twoFactorNeeded = false;
  }
}