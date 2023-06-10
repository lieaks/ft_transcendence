import { gameStatus } from "../interfaces/game.interface";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../users/user";

export class Game {
  id: string;
  status: gameStatus;
  players: User[];
  winner: User;
  createdAt: Date;

  constructor(
	private readonly prismaService: PrismaService,
	id: string,
  ) {
	this.id = id;
	this.status = gameStatus.PLAYING;
	this.players = [];
	this.winner = null;
	this.createdAt = new Date();
  }
}
