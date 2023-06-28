import { Injectable } from '@nestjs/common';
import { IChatUser, IUser, userChatRole } from '../interfaces/user.interface';
import { IMessage, IChat, chatType } from 'src/interfaces/chat.interface';
import { Chat } from './chat';

function getShortChannels(channels: IChat[]) {
  return channels.map((c) => {
    return {
      id: c.id,
      name: c.name,
      type: c.type,
    };
  });
}

@Injectable()
export class ChatService {
  constructor() {}

  private chats: IChat[] = [];

  getChat(id: string): IChat {
    return this.chats.find((c) => c.id === id);
  }
  getChatByName(name: string): IChat {
    return this.chats.find((c) => c.name === name);
  }

  getChats(): IChat[] {
    return this.chats;
  }

  createChat(name: string, type: chatType): IChat {
    if (this.getChatByName(name)) return null;
    const chat = new Chat(this.generateRandomId(), name, type);
    this.chats.push(chat);
    chat.addUser;
    return chat;
  }

  createPrivateChat(user1: IUser, user2: IUser): IChat {
	  const chat = new Chat(this.generateRandomId(), `Private chat between ${user1.name} and ${user2.name}`, chatType.PRIVATE);
	  const userChat1: IChatUser = {
	  	...user1,
	  	role: userChatRole.MEMBER,
	  };
	  const userChat2: IChatUser = {
	  	...user2,
	  	role: userChatRole.MEMBER,
	  };
    chat.users.push(userChat1);
    chat.users.push(userChat2);
    chat.emitToUsers('userJoined', {
      channelId: chat.id,
      user: { id: userChat1.id, name: userChat1.name },
    });
    chat.emitToUsers('userJoined', {
      channelId: chat.id,
      user: { id: userChat2.id, name: userChat2.name },
    });
    chat.emitToUsers('newPrivChannel', getShortChannels([chat])[0]);
	  this.chats.push(chat);
	  return chat;
	}

  removeChat(id: string): void {
    this.chats = this.chats.filter((c) => c.id !== id);
  }

  removeUserFromChannels(user: IUser): IChat[] {
    let emptyChannels: IChat[] = [];

    for (const chat of this.chats) {
      chat.removeUser(user);
      if (!chat.users.length) {
        emptyChannels.push(chat);
        this.removeChat(chat.id);
      }
    }
    return emptyChannels;
  }
  generateRandomId(): string {
    let id = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    do {
      for (let i = 0; i < 15; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (this.getChat(id));
    return id;
  }
}
