import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  Context,
  GqlExecutionContext,
} from '@nestjs/graphql';
import { User, UpdateUserInput } from 'src/graphql';
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

// @UseGuards(JwtAuthGuard) @TODO: uncomment after testing
@Resolver('User')
export class UsersResolver {
  constructor(private readonly PrismaService: PrismaService) {}

  @Query('users')
  async users(): Promise<User[]> {
    return this.PrismaService.user.findMany({ include });
  }

  @Query('user')
  async user(@Args('id') id: string): Promise<User> {
    return this.PrismaService.user.findUnique({
      where: { id },
      include,
    });
  }
  @Query('userByName')
  async userByName(@Args('name') name: string): Promise<User> {
    return this.PrismaService.user.findUnique({
      where: { name },
      include,
    });
  }
  @Query('usersByIds')
  async usersByIds(@Args('ids') ids: string[]): Promise<User[]> {
    return this.PrismaService.user.findMany({
      where: {
        id: { in: ids },
      },
      include,
    });
  }

  @Query('leaderboard')
  async leaderboard(
    @Args('skip') skip: number,
    @Args('take') take: number,
  ): Promise<User[]> {
    skip ??= 0;
    take ??= undefined;
    return this.PrismaService.user.findMany({
      skip,
      take,
      orderBy: {
        experience: 'desc',
      },
    });
  }

  @Mutation('updateUser')
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Context() context,
  ): Promise<User> {
    const { id, name } = context.req.user;
    return this.PrismaService.user.update({
      where: { id },
      data: {
        name: input.name,
        avatar: input.avatar,
        friends: {
          connect: input.friendsToAdd?.map((id) => ({ id })),
          disconnect: input.friendsToRemove?.map((id) => ({ id })),
        },
      },
      include,
    });
  }

  @Mutation('submit2FA')
  async submit2FA(@Args('token') token: string): Promise<boolean> {
    // TODO: if the token is valid, set the 2FA flag to true on the user class
    return true;
  }

  @Mutation('enable2FA')
  async enable2FA(@Context() ctx): Promise<string> {
    // TODO: get the client id from the context token
    // then, generate a 2fa token, put in the db and return it
    const { id, name } = ctx.req.user;
    return 'token';
  }

  @Mutation('disable2FA')
  async disable2FA(@Args('token') token: string): Promise<boolean> {
    if (!(await this.submit2FA(token))) {
      return false;
    }
    // TODO: remove the 2fa token from the db for the user
  }
}
