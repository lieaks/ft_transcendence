import { Resolver, Query } from '@nestjs/graphql';
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
}
