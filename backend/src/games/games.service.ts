import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGame, gameStatus } from 'src/interfaces/game.interface';
import { Game } from './game';
import { Interval } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class GamesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private games: IGame[] = [];
  private queue: IUser[] = [];

  addGame(game: IGame) {
    if (this.getGame(game.id)) return;
    this.games.push(game);
    return game;
  }

  addToQueue(user: IUser): boolean {
    if (!user) return false;
    if (this.queue.find((u) => u.id === user.id)) return false;
    this.queue.push(user);
    console.log('Queue:', this.queue.length);
    if (this.queue.length >= 2) {
      const game = new Game(this.prismaService);
      game.addPlayer(this.queue[0]);
      game.addPlayer(this.queue[1]);
      this.queue.splice(0, 2);
      game.create();
      this.addGame(game);
    }
    return true;
  }

  createCustomGame(firstPlayer: IUser, secondPlayer: IUser) {
    const game = new Game(this.prismaService);
    game.addPlayer(firstPlayer);
    game.addPlayer(secondPlayer);
    game.create();
    this.addGame(game);
  }

  removeFromQueue(user: IUser) {
    this.queue = this.queue.filter((u) => u.id !== user.id);
  }

  removeGame(id: string) {
    this.games = this.games.filter((g) => g.id !== id);
  }

  getGame(id: string) {
    return this.games.find((g) => g.id === id);
  }

  getGames() {
    return this.games;
  }

  // Interval, 1 time per 5 seconds
  // @Interval(3000)
  // checkGames() {
  // 	for (const game of this.games) {
  // 		// userStore.socket?.emit('movePaddle', { direction: 'up' })
  // 		game.emitToPlayers("movePaddle", { player: "left", direction: "up" });
  // 	}
  // }

  @Interval(1000 / 60)
  updateGames() {
    for (const game of this.games) {
      game.update();
      if (game.status === gameStatus.ENDED) {
        this.removeGame(game.id);
      }
    }
  }
}
