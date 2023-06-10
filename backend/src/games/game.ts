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
		this.status = gameStatus.WAITING;
		this.players = [];
		this.winner = null;
		this.createdAt = new Date();
	}

	addPlayer(player: User): void {
		this.players.push(player);
	}

	removePlayer(player: User): void {
		this.players = this.players.filter((p) => p.id !== player.id);
	}

	// Function to create the game in the database
}
