import { IGame, gameStatus } from "../interfaces/game.interface";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../users/user";
import { IUser } from "../interfaces/user.interface";

export class Game implements IGame {
	id: string;
	status: gameStatus;
	players: IUser[];
	createdAt: Date;

	constructor(
		private readonly prismaService: PrismaService,
		id: string,
	) {
		this.id = id;
		this.status = gameStatus.WAITING;
		this.players = [];
		this.createdAt = new Date();
	}

	addPlayer(player: IUser): void {
		this.players.push(player);
	}

	removePlayer(player: IUser): void {
		this.players = this.players.filter((p) => p.id !== player.id);
	}

	async create(): Promise<void> {
		await this.prismaService.game.create({
			data: {
				id: this.id,
				players: {
					connect: this.players.map((p) => ({ id: p.id })),
				},
				createdAt: this.createdAt,
				winner: undefined,
				loser: undefined,
			},
		});
		console.log(`Game ${this.id} created`);
	}

	async finish(winner: IUser, loser: IUser): Promise<void> {
		this.status = gameStatus.ENDED;
		await this.prismaService.game.update({
			where: { id: this.id },
			data: {
				winner: { connect: { id: winner.id } },
				loser: { connect: { id: loser.id } },
				finishedAt: new Date(),
			},
		});
	}

	emitToPlayers(event: string, data: any): void {
		for (const player of this.players) {
			player.socket.emit(event, data);
		}
	}
}
