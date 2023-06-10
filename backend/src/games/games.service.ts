import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IGame } from "src/interfaces/game.interface";
import { Game } from "./game";

@Injectable()
export class GamesService {
	constructor(private readonly prismaService: PrismaService) {}

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
		await game.create();
		this.addGame(game);
		return game;
	}
}
