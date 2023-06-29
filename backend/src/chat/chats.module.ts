import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chats.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
	providers: [ChatService, UsersService, PrismaService],
  exports: [ChatService],
})
export class ChatsModule {}
