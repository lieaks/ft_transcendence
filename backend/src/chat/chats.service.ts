import { Injectable } from "@nestjs/common";
import { IChatUser, IUser } from '../interfaces/user.interface';
import { IMessage, IChat, chatType } from "src/interfaces/chat.interface";
import { Chat } from "./chat";

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
		chat.addUser
		return chat;
	}

	removeChat(id: string): void {
		this.chats = this.chats.filter((c) => c.id !== id);
	}
	removeUserFromChannels(user: IUser): void {
		for (const chat of this.chats) {
			chat.removeUser(user);
		}
	}
	generateRandomId(): string {
		let id = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		do {
			for (let i = 0; i < 15; i++) {
				id += characters.charAt(Math.floor(Math.random() * characters.length));
			}
		} while (this.getChat(id));
		return id;
	}
}
