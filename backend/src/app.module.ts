import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ByteResolver, DateTimeResolver } from 'graphql-scalars';
import { join } from 'path';
import { UsersResolver } from './users/users.resolver';
import { GamesResolver } from './games/games.resolver';
import { HealthController } from './health/health.controller';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';

import { TestModule } from './tests/test.module';

import { GatewayModule } from './gateway/gateway.module';

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
  ],
  controllers: [HealthController],
  providers: [
    UsersResolver,
    GamesResolver,
    TestModule,
    PrismaService,
    UsersService,
  ],
})
export class AppModule {}
