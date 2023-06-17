import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TwoFactorAuthGuard } from 'src/auth/twoFactor-auth.guard';
import * as speakeasy from 'speakeasy';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { User, UpdateUserInput, Status } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

const include = {
  friends: true,
  friendOf: true,
  blocked: true,
  blockedOf: true,
  gameHistory: { include: { players: true, winner: true, loser: true } },
  gamesWon: { include: { players: true, winner: true, loser: true } },
  gamesLost: { include: { players: true, winner: true, loser: true } },
};

@Resolver('User')
@UseGuards(JwtAuthGuard, TwoFactorAuthGuard)
export class UsersResolver {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly UsersService: UsersService,
    private readonly AuthService: AuthService,
  ) {}

  getUserWithExtraValues(user: User): User {
    return {
      status: this.UsersService.getUser(user.id)?.status || Status.OFFLINE,
      ...user,
    };
  }

  @Query('users')
  async users(): Promise<User[]> {
    return this.PrismaService.user.findMany({ include }).then((users) => {
      const modifiedUsers = users.map((user) => {
        return this.getUserWithExtraValues(user);
      });
      return modifiedUsers;
    });
  }

  @Query('user')
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
      where: { id },
      include,
    });
    return user ? this.getUserWithExtraValues(user) : null;
  }
  @Query('me')
  async me(@Context() context): Promise<User> {
    return this.user(context.req.user.id);
  }
  @Query('userByName')
  async userByName(@Args('name') name: string): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
      where: { name },
      include,
    });
    return user ? this.getUserWithExtraValues(user) : null;
  }
  @Query('usersByIds')
  async usersByIds(@Args('ids') ids: string[]): Promise<User[]> {
    return this.PrismaService.user
      .findMany({
        where: {
          id: { in: ids },
        },
        include,
      })
      .then((users) => {
        const modifiedUsers = users.map((user) => {
          return this.getUserWithExtraValues(user);
        });
        return modifiedUsers;
      });
  }

  @Query('leaderboard')
  async leaderboard(
    @Args('skip') skip: number,
    @Args('take') take: number,
  ): Promise<User[]> {
    skip ??= 0;
    take ??= undefined;
    return this.PrismaService.user
      .findMany({
        skip,
        take,
        orderBy: {
          experience: 'desc',
        },
        include,
      })
      .then((users) => {
        const modifiedUsers = users.map((user) => {
          return this.getUserWithExtraValues(user);
        });
        return modifiedUsers;
      });
  }

  @Mutation('updateUser')
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Context() context,
  ): Promise<User> {
    const { id } = context.req.user;
    const user = await this.PrismaService.user.update({
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
    return user ? this.getUserWithExtraValues(user) : null;
  }

  @Mutation('submit2FA')
  @SetMetadata('skipTwoFactorAuth', true)
  async submit2FA(
    @Args('code') code: string,
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
    if (code != totpCode) {
      console.log('totpCode', totpCode);
      return false;
    }
    this.AuthService.removeIdRequireTwoFactor(id);
    return true;
  }

  @Mutation('enable2FA')
  async enable2FA(@Context() ctx): Promise<string> {
    const { id } = ctx.req.user;
    let user = await this.PrismaService.user.findUnique({ where: { id } });
    if (user?.twoFactorSecret) return null;

    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    user = await this.PrismaService.user.update({
      where: { id },
      data: { twoFactorSecret: secret },
    });
    return user?.twoFactorSecret;
  }

  @Mutation('disable2FA')
  async disable2FA(
    @Args('code') code: string,
    @Context() ctx,
  ): Promise<boolean> {
    if (!(await this.submit2FA(code, ctx))) {
      return false;
    }
    const { id } = ctx.req.user;
    await this.PrismaService.user.update({
      where: { id },
      data: { twoFactorSecret: null },
    });
    this.AuthService.removeIdRequireTwoFactor(id);
    return true;
  }
}
