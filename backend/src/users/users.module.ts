import { Module, forwardRef } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsModule } from 'src/chat/chats.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), ChatsModule],
  providers: [UsersResolver, UsersService, ChatsModule],
  exports: [UsersResolver, UsersService],
})
export class UsersModule {}
