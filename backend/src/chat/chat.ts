import { IChat, IMessage, chatCategory } from "src/interfaces/chat.interface";
import { IUser } from "src/interfaces/user.interface";

export class Chat implements IChat {
	id: string;
	category: chatCategory;
	createdAt: Date;
	updatedAt: Date;
	messages: IMessage[];
	users: IUser[];

	constructor(id: string, category: chatCategory) {
		this.id = id;
		this.category = category;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.messages = [];
		this.users = [];
	}

	addMessage(message: IMessage): void {
		this.messages.push(message);
	}

	addUser(user: IUser): void {
		if (!this.users.find((u) => u.id === user.id)) {
			this.users.push(user);
		}
	}

	removeUser(user: IUser): void {
		if (this.users.find((u) => u.id === user.id)) {
			this.users = this.users.filter((u) => u.id !== user.id);
		}
	}

	emitToUsers(event: string, data: any): void {
		for (const user of this.users) {
			user.socket.emit(event, data);
		}
	}
}
