import { Resolver, Query, Args } from '@nestjs/graphql';
import { Game } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('Game')
export class GamesResolver {
	constructor(private readonly PrismaService: PrismaService) {}

	@Query('games')
	async games(): Promise<Game[]> {
		const prismaGames = await this.PrismaService.game.findMany({
			include: { players: true },
		});
		console.log(prismaGames);
		return prismaGames;
	}

	@Query('game')
	async game(@Args('id') id: string): Promise<Game> {
		return this.PrismaService.game.findUnique({
			where: { id: id },
			include: { players: true },
		});
	}
}
