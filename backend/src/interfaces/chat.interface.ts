import { IUser } from "./user.interface";
import { IChatUser, IBannedUser, IMutedUser, userChatRole } from "src/interfaces/user.interface";

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
	users: IChatUser[];
	mutedUsers: IMutedUser[];
	bannedUsers: IBannedUser[];
	addMessage(message: IMessage): void;
	addUser(user: IChatUser): void;
	removeUser(user: IUser): void;
	emitToUsers(event: string, data: any): void;
}
