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

	createChat(id: string, category: chatCategory): IChat {
		if (this.getChat(id)) return;
		const chat = new Chat(id, category);
		this.chats.push(chat);
		return chat;
	}

	removeChat(id: string): void {
		this.chats = this.chats.filter((c) => c.id !== id);
	}
}