import { Module, forwardRef } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [UsersResolver],
})
export class UsersModule {}
