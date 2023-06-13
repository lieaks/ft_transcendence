import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IGame, gameStatus } from "src/interfaces/game.interface";
import { Game } from "./game";
import { Interval } from "@nestjs/schedule";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GamesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService,
	) {}

	private games: IGame[] = [];

	addGame(game: IGame) {
		if (this.getGame(game.id)) return;
		this.games.push(game);
		return game;
	}

	removeGame(id: string) {
		this.games = this.games.filter((g) => g.id !== id);
	}

	getGame(id: string) {
		return this.games.find((g) => g.id === id);
	}

	async createGame(id: string): Promise<IGame> {
		const game = new Game(this.prismaService, id);
		game.addPlayer(this.usersService.getUser(id));
		await game.create();
		this.addGame(game);
		return game;
	}

	// Interval, 1 time per 5 seconds
	@Interval(3000)
	checkGames() {
		if (this.usersService.getUsers().length === 2) {
			const game = new Game(this.prismaService, "test");
			game.addPlayer(this.usersService.getUsers()[0]);
			game.addPlayer(this.usersService.getUsers()[1]);
			game.create();
			this.addGame(game);
		} else {
			console.log("Waiting for players..." + this.usersService.getUsers().length);
		}
	}
}
