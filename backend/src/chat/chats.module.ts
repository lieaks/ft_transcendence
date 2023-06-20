import { Module } from '@nestjs/common';
import { ChatService } from './chats.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatsModule {}
