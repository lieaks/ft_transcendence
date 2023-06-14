import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GamesModule } from 'src/games/games.module';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [AuthModule, UsersModule, GamesModule, PrismaModule],
  providers: [MyGateway],
})
export class GatewayModule {}
