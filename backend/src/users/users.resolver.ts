import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User as prismaUser } from '@prisma/client'
import { User as gplUser, CreateUserInput, UpdateUserInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('User')
export class UsersResolver {
	constructor(private readonly PrismaService: PrismaService) {}

	@Query('users')
	async users(): Promise<gplUser[]> {
		const prismaUser = this.PrismaService.user.findMany({});
		console.log(await prismaUser);
		// TODO: debug why nested object are not here but in prisma studio
		return prismaUser
	}

	@Query('user')
	async user(@Args('id') id: string): Promise<gplUser> {
		return this.PrismaService.user.findUnique({
			where: { id: id }
		})
	}
	@Query('userByName')
	async userByName(@Args('name') name: string): Promise<gplUser> {
		return this.PrismaService.user.findUnique({
			where: { name: name }
		})
	}
	@Query('usersByIds')
	async usersByIds(@Args('ids') ids: string[]): Promise<gplUser[]> {
		return this.PrismaService.user.findMany({
			where: {
				name: {
					in: ids
				}
			}
		})
	}
}
