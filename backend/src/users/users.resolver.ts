import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as speakeasy from 'speakeasy';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { User, UpdateUserInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

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
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly UsersService: UsersService,
  ) {}

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
    const { id } = context.req.user;
    return this.PrismaService.user.update({
      where: { id },
      data: {
        name: input.name,
        avatar: input.avatar,
        friends: {
          connect: input.friendsToAdd?.map((id) => ({ id })),
          disconnect: input.friendsToRemove?.map((id) => ({ id })),
        },
        blocked: {
          connect: input.usersToBlock?.map((id) => ({ id })),
          disconnect: input.usersToUnblock?.map((id) => ({ id })),
        },
      },
      include,
    });
  }

  @Mutation('submit2FA')
  async submit2FA(
    @Args('token') token: string,
    @Context() ctx,
  ): Promise<boolean> {
    const { id } = ctx.req.user;
    const { twoFactorSecret } = await this.PrismaService.user.findUnique({
      where: { id },
    });
    const totpCode = speakeasy.totp({
      secret: twoFactorSecret,
      encoding: 'base32',
    });
    if (token != totpCode) {
      console.log('totpCode', totpCode);
      return false;
    }
    this.UsersService.removeTwoFactor(id);
    return true;
  }

  @Mutation('enable2FA')
  async enable2FA(@Context() ctx): Promise<string> {
    const { id } = ctx.req.user;
    console.log('id', id);

    const secret = speakeasy.generateSecret({ length: 20 });
    await this.PrismaService.user.update({
      where: { id },
      data: { twoFactorSecret: secret.base32 },
    });
    return secret.base32;
  }

  @Mutation('disable2FA')
  async disable2FA(
    @Args('token') token: string,
    @Context() ctx,
  ): Promise<boolean> {
    if (!(await this.submit2FA(token, ctx))) {
      return false;
    }
    const { id } = ctx.req.user;
    this.UsersService.removeTwoFactor(id);
    await this.PrismaService.user.update({
      where: { id },
      data: { twoFactorSecret: null },
    });
    return true;
  }
}
