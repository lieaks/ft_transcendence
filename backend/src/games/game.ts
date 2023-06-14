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
	ball: { x: number; y: number; radius: number; dx: number; dy: number };
	leftPaddle: { x: number; y: number; width: number; height: number; speed: number };
	rightPaddle: { x: number; y: number; width: number; height: number; speed: number };

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
			radius: 10,
			dx: 5,
			dy: 5,
		};
		this.leftPaddle = {
			x: 20,
			y: this.canvas.height / 2,
			width: 20,
			height: 175,
			speed: 17,
		};
		this.rightPaddle = {
			x: this.canvas.width - 20,
			y: this.canvas.height / 2,
			width: 20,
			height: 175,
			speed: 17,
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

	movePaddle(player: IUser, direction: string): void {
		if (player.id === this.players[0].id) {
			if (direction === "up" && this.leftPaddle.y > this.leftPaddle.speed - 2) {
				this.leftPaddle.y -= this.leftPaddle.speed;
			} else if (direction === "down" && this.leftPaddle.y < this.canvas.height - this.leftPaddle.height - this.leftPaddle.speed + 2) {
				this.leftPaddle.y += this.leftPaddle.speed;
			}
			this.emitToPlayers("updatePaddlePosition", { player: "left", y: this.leftPaddle.y });
		} else if (player.id === this.players[1].id) {
			if (direction === "up" && this.rightPaddle.y > this.rightPaddle.speed - 2) {
				this.rightPaddle.y -= this.rightPaddle.speed;
			} else if (direction === "down" && this.rightPaddle.y < this.canvas.height - this.rightPaddle.height - this.rightPaddle.speed + 2) {
				this.rightPaddle.y += this.rightPaddle.speed;
			}
			this.emitToPlayers("updatePaddlePosition", { player: "right", y: this.rightPaddle.y });
		}
	}

	update(): void {
		this.ball.x += this.ball.dx;
		this.ball.y += this.ball.dy;

		// Check for collision with left paddle
		if (
			this.ball.x - this.ball.radius <= this.leftPaddle.x + this.leftPaddle.width &&
			this.ball.y >= this.leftPaddle.y &&
			this.ball.y <= this.leftPaddle.y + this.leftPaddle.height
		) {
			this.ball.dx = -this.ball.dx;
			this.ball.x = this.leftPaddle.x + this.leftPaddle.width + this.ball.radius;
		}

		// Check for collision with right paddle
		if (
			this.ball.x + this.ball.radius >= this.rightPaddle.x &&
			this.ball.y >= this.rightPaddle.y &&
			this.ball.y <= this.rightPaddle.y + this.rightPaddle.height
		) {
			this.ball.dx = -this.ball.dx;
			this.ball.x = this.rightPaddle.x - this.ball.radius;
		}

		if (this.ball.x < this.ball.radius) {
			this.ball.x = this.ball.radius;
			this.ball.dx = -this.ball.dx;
		} else if (this.ball.x > this.canvas.width - this.ball.radius) {
			this.ball.x = this.canvas.width - this.ball.radius;
			this.ball.dx = -this.ball.dx;
		}
		if (this.ball.y < this.ball.radius) {
			this.ball.y = this.ball.radius;
			this.ball.dy = -this.ball.dy;
		} else if (this.ball.y > this.canvas.height - this.ball.radius) {
			this.ball.y = this.canvas.height - this.ball.radius;
			this.ball.dy = -this.ball.dy;
		}
		this.emitToPlayers("updateBallPosition", { x: this.ball.x, y: this.ball.y});
	}

	emitToPlayers(event: string, data: any): void {
		// console.log(`Emitting ${event} to players of game ${this.id}`);
		for (const player of this.players) {
			player.socket.emit(event, data);
		}
	}
}
