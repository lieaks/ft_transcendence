import { Module, forwardRef } from '@nestjs/common';
import { GamesResolver } from './games.resolver';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [GamesResolver],
})
export class GamesModule {}
