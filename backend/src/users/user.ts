import { IUser, Status } from '../interfaces/user.interface';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

export class User implements IUser {
  id: string;
  name: string;
  status: Status;
  socket: Socket;

  constructor(
    private readonly PrismaService: PrismaService,
    id: string,
    name?: string,
  ) {
    this.id = id;
    this.status = Status.OFFLINE;
    this.socket = null;
    this.name = name;
  }

  async addExperience(exp: number): Promise<number> {
    const user = await this.PrismaService.user.update({
      where: { id: this.id },
      data: { experience: { increment: exp } },
    });
    return user.experience;
  }

  async getStatus(): Promise<Status> {
    return this.status;
  }
}
