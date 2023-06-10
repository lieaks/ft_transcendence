import { Module, forwardRef } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';

@Module({
	imports: [
		forwardRef(() => AppModule),
	],
  providers: [UsersResolver, PrismaService],
})
export class UsersModule {}
