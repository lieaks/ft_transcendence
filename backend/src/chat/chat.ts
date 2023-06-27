import { IChat, IMessage, chatType } from "src/interfaces/chat.interface";
import { IChatUser, IBannedUser, IMutedUser, userChatRole } from "src/interfaces/user.interface";

export class Chat implements IChat {
	id: string;
	name: string;
	type: chatType;
	createdAt: Date;
	updatedAt: Date;
	messages: IMessage[];
	users: IChatUser[];
	mutedUsers: IMutedUser[];
	bannedUsers: IBannedUser[];

	constructor(id: string, name: string, type: chatType) {
		this.id = id
		this.name = name;
		this.type = type;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.messages = [];
		this.users = [];
		this.mutedUsers = [];
		this.bannedUsers = [];
	}

	kickUser(user: IChatUser, kickedBy: IChatUser): void {
		if (user.role !== userChatRole.ADMIN || kickedBy.role === userChatRole.CREATOR) return;
		if (this.users.find((u) => u.id === user.id)) {
			this.users = this.users.filter((u) => u.id !== user.id);
			const { socket: userSocket, ...userWithoutSocket } = user;
			const { socket: kickedBySocket, ...kickedByWithoutSocket } = kickedBy;
			this.emitToUsers("userKicked", { channelId: this.id, user: userWithoutSocket, kickedBy: kickedByWithoutSocket })
		}
	}

	addMessage(message: IMessage): void {
		this.updatedAt = new Date();
		this.messages.push(message);
		this.emitToUsers("newMessage", { channelId: this.id, message: {
			sender: {
				id: message.sender.id,
				name: message.sender.name
			},
			content: message.content,
		}});
	}

	addUser(user: IChatUser): void {
		if (!this.users.find((u) => u.id === user.id)) {
			this.users.push(user);
			this.emitToUsers("userJoined", {channelId: this.id, user: { id: user.id, name: user.name } })
			console.log("user Role: " + user.role)
		}
	}

	removeUser(user: IChatUser): void {
		if (this.users.find((u) => u.id === user.id)) {
			this.users = this.users.filter((u) => u.id !== user.id);
			const { socket, ...userWithoutSocket } = user;
			this.emitToUsers("userLeft", userWithoutSocket)
		}
	}

	emitToUsers(event: string, data: any): void {
		for (const user of this.users) {
			user.socket.emit(event, data);
		}
	}
}
