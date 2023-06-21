export enum chatType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}
export interface IUser {
	id: string;
	name: string;
}
export interface IMessage {
	sender: IUser;
	content: string;
}
export interface IChannel {
	id: string;
	name: string;
	type: chatType;
	users: IUser[];
	messages: IMessage[];
}
