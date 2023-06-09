import { Module } from '@nestjs/common';
import { GamesResolver } from './games.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [GamesResolver, PrismaService],
})
export class GamesModule {}
