import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User as prismaUser } from '@prisma/client';
import { User as gplUser, CreateUserInput, UpdateUserInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

const include = {
	friends: true,
	friendOf: true,
	blocked: true,
	blockedOf: true,
	gameHistory: { include: { players: true } },
	gamesWon: { include: { players: true } },
	gamesLost: { include: { players: true } },
};

@Resolver('User')
// @UseGuards(GqlAuthGuard) // implement auth guards
export class UsersResolver {
	constructor(private readonly PrismaService: PrismaService) {}

	@Query('users')
	async users(): Promise<gplUser[]> {
		return this.PrismaService.user.findMany({ include });
	}

	@Query('user')
	async user(@Args('id') id: string): Promise<gplUser> {
		return this.PrismaService.user.findUnique({
			where: { id },
			include,
		});
	}
	@Query('userByName')
	async userByName(@Args('name') name: string): Promise<gplUser> {
		return this.PrismaService.user.findUnique({
			where: { name },
			include,
		});
	}
	@Query('usersByIds')
	async usersByIds(@Args('ids') ids: string[]): Promise<gplUser[]> {
		return this.PrismaService.user.findMany({
			where: {
				id: { in: ids },
			},
			include,
		});
	}
}
