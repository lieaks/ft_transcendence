import { ExecutionContext } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, GraphQLExecutionContext, GqlExecutionContext } from '@nestjs/graphql';
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

	@Mutation('updateUser')
	async updateUser(@Args('input') input: UpdateUserInput,	@Context() context: any): Promise<gplUser> {
		const token = context.req.headers.authorization;
		console.log(token);
		// the token should be hashed in the db
		// TODO: finish implementation, get the user associated with this token and modifie it
		return this.PrismaService.user.findUnique({
			where: { name: input.name },
			});
	}

	@Mutation('submit2FA')
	async submit2FA(@Args('token') token: string): Promise<boolean> {
		// TODO: if the token is valid, set the 2FA flag to true on the user class
		return true;
	}

	@Mutation('enable2FA')
	async enable2FA(): Promise<string> {
		// TODO: get the client id from the context token
		// then, generate a 2fa token, put in the db and return it
		return 'token';
	}

	@Mutation('disable2FA')
	async disable2FA(@Args('token') token: string): Promise<boolean> {
		if (!await this.submit2FA(token)) {
			return false;
		}
		// TODO: remove the 2fa token from the db for the user
	}
}
