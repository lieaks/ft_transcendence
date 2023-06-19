import { IUser } from "./user.interface";

export enum chatCategory {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}

export interface IMessage {
	senderId: string;
	content: string;
	createdAt: Date;
}

export interface IChat {
	id: string;
	category: chatCategory;
	createdAt: Date;
	updatedAt: Date;
	messages: IMessage[];
	users: IUser[];
	addMessage(message: IMessage): void;
	addUser(user: IUser): void;
	removeUser(user: IUser): void;
	emitToUsers(event: string, data: any): void;
}
