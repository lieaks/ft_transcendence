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
    console.log(
      'users stored: ',
	  this.users.map((u) => ({
		id: u.id,
		name: u.name,
		socket: u.socket,
	  })),
    );
    return user;
  }

  removeUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }

  removeUserBySocket(socket: any) {
	this.users = this.users.filter((u) => u.socket.id !== socket.id);
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

  setSocket(id: string, socket: any) {
	const user = this.getUser(id);
	if (user) user.socket = socket;
  }

  @Interval(3000)
  printUsers() {
    console.log('Users: ');
    console.log(
      this.users.map((u) => ({
        id: u.id,
        name: u.name,
		socket: u.socket,
      })),
    );
  }
}
