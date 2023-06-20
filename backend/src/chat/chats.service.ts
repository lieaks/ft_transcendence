import { Injectable } from "@nestjs/common";
import { IUser } from '../interfaces/user.interface';
import { IMessage, IChat, chatCategory } from "src/interfaces/chat.interface";
import { Chat } from "./chat";

@Injectable()
export class ChatService {
	constructor() {}

	private chats: IChat[] = [];

	getChat(id: string): IChat {
		return this.chats.find((c) => c.id === id);
	}

	getChats(): IChat[] {
		return this.chats;
	}

	createChat(category: chatCategory): IChat {
		// if (this.getChat(id)) return;
		const id = this.generateRandomId()
		const chat = new Chat(id, category);
		this.chats.push(chat);
		return chat;
	}

	removeChat(id: string): void {
		this.chats = this.chats.filter((c) => c.id !== id);
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