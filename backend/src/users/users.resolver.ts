import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User as prismaUser } from '@prisma/client'
import { User as gplUser, CreateUserInput, UpdateUserInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('User')
export class UsersResolver {
	constructor(private readonly PrismaService: PrismaService) {}

	@Query('users')
	async users(): Promise<gplUser[]> {
		return this.PrismaService.user.findMany({
			include: {
				friends: true,
				friendOf: true,
				blocked: true,
				blockedOf: true,
				gameHistory: true,
				gamesWon: true,
				gamesLost: true
			}
		});
	}

	@Query('user')
	async user(@Args('id') id: string): Promise<gplUser> {
		return this.PrismaService.user.findUnique({
			where: { id: id },
			include: {
				friends: true,
				friendOf: true,
				blocked: true,
				blockedOf: true,
				gameHistory: true,
				gamesWon: true,
				gamesLost: true
			}
		})
	}
	@Query('userByName')
	async userByName(@Args('name') name: string): Promise<gplUser> {
		return this.PrismaService.user.findUnique({
			where: { name: name },
			include: {
				friends: true,
				friendOf: true,
				blocked: true,
				blockedOf: true,
				gameHistory: true,
				gamesWon: true,
				gamesLost: true
			}
		})
	}
	@Query('usersByIds')
	async usersByIds(@Args('ids') ids: string[]): Promise<gplUser[]> {
		return this.PrismaService.user.findMany({
			where: {
				id: { in: ids }
			},
			include: {
				friends: true,
				friendOf: true,
				blocked: true,
				blockedOf: true,
				gameHistory: true,
				gamesWon: true,
				gamesLost: true
			}
		})
	}
}
