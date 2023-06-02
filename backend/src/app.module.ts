import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { UsersResolver } from './users/users.resolver';
import { GamesResolver } from './games/games.resolver';
import { HealthController } from './health/health.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
	  subscriptions: {
		  'graphql-ws': true
	  },
	  typePaths: ['./**/*.graphql'],
	  definitions: {
		  path: join(process.cwd(), 'src/graphql.ts'),
		  emitTypenameField: true,
	  },
	  playground: false,
	  plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [HealthController],
  providers: [UsersResolver, GamesResolver, PrismaService],
})
export class AppModule {}
