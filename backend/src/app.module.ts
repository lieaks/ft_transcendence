import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ByteResolver, DateTimeResolver } from 'graphql-scalars';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { TestModule } from './tests/test.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatsModule } from './chat/chats.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        emitTypenameField: true,
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      resolvers: { DateTime: DateTimeResolver, Byte: ByteResolver },
    }),
    UsersModule,
    GamesModule,
    AuthModule,
    TestModule,
    GatewayModule,
    ScheduleModule.forRoot(),
    GatewayModule,
    PrismaModule,
    ChatsModule,
  ],
  controllers: [HealthController],
  providers: [TestModule],
})
export class AppModule {}
