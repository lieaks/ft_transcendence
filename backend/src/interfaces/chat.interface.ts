import { IUser } from "./user.interface";

export enum chatType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}

export interface IMessage {
	sender: IUser;
	content: string;
	createdAt: Date;
}

export interface IChat {
	id: string;
	name: string;
	type: chatType;
	createdAt: Date;
	updatedAt: Date;
	messages: IMessage[];
	users: IUser[];
	addMessage(message: IMessage): void;
	addUser(user: IUser): void;
	removeUser(user: IUser): void;
	emitToUsers(event: string, data: any): void;
}
