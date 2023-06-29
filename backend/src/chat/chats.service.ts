import { Injectable } from '@nestjs/common';
import { IChatUser, IUser, userChatRole } from '../interfaces/user.interface';
import { IMessage, IChat, chatType } from 'src/interfaces/chat.interface';
import { UsersService } from '../users/users.service';
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
function getShortUser(user: IChatUser) {
	return {
		id: user.id,
		name: user.name,
		role: user.role,
	};
}

@Injectable()
export class ChatService {
  constructor() { }

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
    return chat;
  }

  createPrivateChat(user1: IUser, user2: IUser): IChat {
    const chat = new Chat(
      this.generateRandomId(),
      `${user1.name} <-> ${user2.name}`,
      chatType.PRIVATE,
    );
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
		chat.emitToUsers('newChannel', {
			...getShortChannels([chat])[0],
			users: [getShortUser(userChat1), getShortUser(userChat2)]
		});
    this.chats.push(chat);
    return chat;
  }

  removeChat(id: string): void {
    this.chats = this.chats.filter((c) => c.id !== id);
  }

  removeUserFromChannels(user: IUser): IChat[] {
    const emptyChannels: IChat[] = [];

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

	updateUser(user: IUser) {
		for (const chat of this.chats) {
			const cuser = chat.users.find((u) => u.id === user.id)
			if (cuser) {
				console.log('updating user', user.name);
				cuser.name = user.name;
				cuser.blockedIds = user.blockedIds;
			}
		};
	}
}
