import { IGame, gameStatus } from "../interfaces/game.interface";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../users/user";
import { IUser } from "../interfaces/user.interface";

export class Game implements IGame {
	id: string;
	status: gameStatus;
	players: IUser[];
	createdAt: Date;
	canvas: { width: number; height: number };
	ball: { x: number; y: number; dx: number; dy: number };

	constructor(
		private readonly prismaService: PrismaService,
	) {
		this.status = gameStatus.WAITING;
		this.players = [];
		this.createdAt = new Date();
		this.canvas = {
			width: 1600,
			height: 800,
		};
		this.ball = {
			x: this.canvas.width / 2,
			y: this.canvas.height / 2,
			dx: 5,
			dy: 5,
		};
	}

	addPlayer(player: IUser): void {
		this.players.push(player);
	}

	removePlayer(player: IUser): void {
		this.players = this.players.filter((p) => p.id !== player.id);
	}

	async create(): Promise<void> {
		const game = await this.prismaService.game.create({
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
		this.id = game.id;
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

	update(): void {
		const nextX = this.ball.x + this.ball.dx;
		const nextY = this.ball.y + this.ball.dy;
		if (nextX < 0 || nextX > this.canvas.width) {
			this.ball.dx = -this.ball.dx;
		}
		if (nextY < 0 || nextY > this.canvas.height) {
			this.ball.dy = -this.ball.dy;
		}
		this.ball.x += this.ball.dx;
		this.ball.y += this.ball.dy;
		this.emitToPlayers("updateBallPosition", { x: this.ball.x, y: this.ball.y});
	}

	emitToPlayers(event: string, data: any): void {
		// console.log(`Emitting ${event} to players of game ${this.id}`);
		for (const player of this.players) {
			player.socket.emit(event, data);
		}
	}
}
