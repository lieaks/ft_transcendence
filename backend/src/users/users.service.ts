import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { User } from './user';
import { PrismaService } from 'src/prisma/prisma.service';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private users: IUser[] = [];

  addUser(user: IUser) {
    console.log('adding user: ', user.id);
    if (this.getUser(user.id)) return;
    this.users.push(user);
    return user;
  }

  removeUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }

  removeUserBySocket(socket: any) {
    this.users = this.users.filter((u) => u.socket.id !== socket.id);
  }

  getUser(id: string) {
    return this.users.find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this.users.find((u) => u.name === name);
  }

  getUserBySocketId(id: string) {
    return this.users.find((u) => u.socket.id === id);
  }

  getUsers() {
    return this.users;
  }

  requireTwoFactor(id: string) {
    const user = this.getUser(id);
    user.twoFactorNeeded = true;
  }

  removeTwoFactor(id: string) {
    const user = this.getUser(id);
    user.twoFactorNeeded = false;
  }

  setSocket(id: string, socket: any) {
    const user = this.getUser(id);
    user.socket = socket;
  }

  //   @Interval(3000)
  //   printUsers() {
  //     console.log('Users: ');
  //     console.log(
  //       this.users.map((u) => ({
  //         id: u.id,
  //         name: u.name,
  // 		socket: u.socket,
  //       })),
  //     );
  //   }
}
