import { IUser, userStatus } from '../interfaces/user.interface';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

export class User implements IUser {
  id: string;
  name: string;
  twoFactorNeeded: boolean;
  status: userStatus;
  socket: Socket;

  constructor(
    private readonly prismaService: PrismaService,
    id: string,
    name?: string,
  ) {
    this.id = id;
    this.twoFactorNeeded = false;
    this.status = userStatus.OFFLINE;
    this.socket = null;
		this.name = name;
  }

  async addExperience(exp: number): Promise<number> {
    const user = await this.prismaService.user.update({
      where: { id: this.id },
      data: { experience: { increment: exp } },
    });
    return user.experience;
  }
}
