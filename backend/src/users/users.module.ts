import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { User } from './user';

@Module({
  providers: [UsersResolver, PrismaService, UsersService, User],
})
export class UsersModule {}
