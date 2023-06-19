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
	addMessage(message: IMessage): void;
}
