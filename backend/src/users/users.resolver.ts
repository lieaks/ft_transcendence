import { Resolver, Query } from '@nestjs/graphql';
import { User as prismaUser } from '@prisma/client'
import { User as gplUser, CreateUserInput, UpdateUserInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('User')
export class UsersResolver {
	constructor(private readonly PrismaService: PrismaService) {}

	@Query('allUsers')
	async allUsers(): Promise<gplUser[]> {
		const prismaUsers: prismaUser[] = await this.PrismaService.user.findMany({});

		// Map the Prisma users to GraphQL users
		const gqlUsers: gplUser[] = prismaUsers.map((user: prismaUser) => {
			const { avatar, createdAt, ...rest } = user;
			return {
				...rest,
				avatar: avatar?.toString() ?? 'default-avatar',
				createdAt: createdAt.toString(),
			};
		});

		return gqlUsers;
	}
}
