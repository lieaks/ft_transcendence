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
	score: { left: number; right: number };
	scoreLimit: number;

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
		this.score = {
			left: 0,
			right: 0,
		};
		this.scoreLimit = 5;
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
		this.startGame();
		this.reset();
		this.emitToPlayers("updateScore", { left: this.score.left, right: this.score.right });
		console.log(`Game ${this.id} created`);
	}

	async finish(): Promise<void> {
		this.status = gameStatus.ENDED;
		const winner = this.score.left > this.score.right ? this.players[0] : this.players[1];
		const loser = this.score.left > this.score.right ? this.players[1] : this.players[0];

		await this.prismaService.game.update({
			where: { id: this.id },
			data: {
				winner: { connect: { id: winner.id } },
				loser: { connect: { id: loser.id } },
				finishedAt: new Date(),
			},
		});
	}

	startGame(): void {
		this.status = gameStatus.PLAYING;
		this.emitToPlayers("startGame", { id : this.id });
	}

	updateScore(): void {
		if (this.ball.x < this.ball.radius || this.ball.x > this.canvas.width - this.ball.radius) {
			if (this.ball.x < this.ball.radius) {
				this.score.right++;
				this.ball.dx = 5;
			}
			else {
				this.score.left++;
				this.ball.dx = -5;
			}
			this.reset();
			this.emitToPlayers("updateScore", { left: this.score.left, right: this.score.right });
			if (this.score.left === this.scoreLimit || this.score.right === this.scoreLimit) {
				this.finish();
			}
		}
	}

	reset(): void {
		this.ball.x = this.canvas.width / 2;
		this.ball.y = this.canvas.height / 2;
		this.ball.dy = 5;
		this.leftPaddle.y = this.canvas.height / 2 - this.leftPaddle.height / 2;
		this.rightPaddle.y = this.canvas.height / 2 - this.rightPaddle.height / 2;
		this.emitToPlayers("updatePaddlePosition", { player: "left", y: this.leftPaddle.y });
		this.emitToPlayers("updatePaddlePosition", { player: "right", y: this.rightPaddle.y });
		this.emitToPlayers("updateBallPosition", { x: this.ball.x, y: this.ball.y });

	}

	movePaddle(player: IUser, direction: string): void {
		if (player.id === this.players[0].id) {
			if (direction === "up" && this.leftPaddle.y > this.leftPaddle.speed - 2) {
				this.leftPaddle.y -= this.leftPaddle.speed;
			} else if (direction === "down" && this.leftPaddle.y + this.leftPaddle.height < this.canvas.height - this.leftPaddle.speed + 2) {
				this.leftPaddle.y += this.leftPaddle.speed;
			}
			this.emitToPlayers("updatePaddlePosition", { player: "left", y: this.leftPaddle.y });
		} else if (player.id === this.players[1].id) {
			if (direction === "up" && this.rightPaddle.y > this.rightPaddle.speed - 2) {
				this.rightPaddle.y -= this.rightPaddle.speed;
			} else if (direction === "down" && this.rightPaddle.y + this.rightPaddle.height < this.canvas.height - this.rightPaddle.speed + 2) {
				this.rightPaddle.y += this.rightPaddle.speed;
			}
			this.emitToPlayers("updatePaddlePosition", { player: "right", y: this.rightPaddle.y });
		}
	}

	update(): void {
		this.ball.x += this.ball.dx;
		this.ball.y += this.ball.dy;

		// Collision with left Paddle
		if (
			this.ball.x - this.ball.radius <= this.leftPaddle.x + this.leftPaddle.width &&
			this.ball.y >= this.leftPaddle.y &&
			this.ball.y <= this.leftPaddle.y + this.leftPaddle.height
		) {
			this.ball.dx *= 1.1;
			this.ball.dx = -this.ball.dx;
			this.ball.x = this.leftPaddle.x + this.leftPaddle.width + this.ball.radius;
		}

		// Collision with right Paddle
		if (
			this.ball.x + this.ball.radius >= this.rightPaddle.x - this.rightPaddle.width &&
			this.ball.y >= this.rightPaddle.y &&
			this.ball.y <= this.rightPaddle.y + this.rightPaddle.height
		) {
			this.ball.dx *= 1.1;
			this.ball.dx = -this.ball.dx;
			this.ball.x = this.rightPaddle.x - this.rightPaddle.width - this.ball.radius;
		}

		if (this.ball.x < this.ball.radius || this.ball.x > this.canvas.width - this.ball.radius) {
			this.updateScore();
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
