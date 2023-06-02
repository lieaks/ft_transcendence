import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { UsersResolver } from './users/users.resolver';
import { GamesResolver } from './games/games.resolver';

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
  controllers: [AppController],
  providers: [AppService, UsersResolver, GamesResolver],
})
export class AppModule {}
