import { Resolver, Query, Args } from '@nestjs/graphql';
import { Game, User } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { GamesService } from './games.service';

@Resolver('Game')
export class GamesResolver {
  constructor (
    private readonly PrismaService: PrismaService, 
    private readonly gamesService: GamesService
  ) {}

  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query('games')
  async games(): Promise<Game[]> {
    return this.PrismaService.game.findMany({
      include: { players: true },
    });
  }

  @Query('game')
  async game(@Args('id') id: string): Promise<Game> {
    return this.PrismaService.game.findUnique({
      where: { id: id },
      include: { players: true },
    });
  }

  @Query('getPlayersByGameId')
  async getPlayersByGameId(@Args('id') id: string): Promise<User[]> {
    const game = await this.PrismaService.game.findUnique({
      where: { id: id },
      include: { players: true },
    });
    return game.players;
  }

  @Query('getCurrentGames')
  async getCurrentGames(): Promise<Game[]> {
    return this.PrismaService.game.findMany({
      where: { finishedAt: null },
      include: { players: true },
    });
  }
}
