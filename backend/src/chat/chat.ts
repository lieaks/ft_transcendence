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
		if (user.role === userChatRole.MEMBER || kickedBy.role === userChatRole.CREATOR) return;
		if (this.users.find((u) => u.id === user.id)) {
      this.removeUser(user);
			const { socket: userSocket, ...userWithoutSocket } = user;
			const { socket: kickedBySocket, ...kickedByWithoutSocket } = kickedBy;
			this.emitToUsers("userKicked", { channelId: this.id, user: userWithoutSocket, kickedBy: kickedByWithoutSocket })
		}
	}

  banUser(user: IChatUser, bannedBy: IChatUser, seconds: string): void {
    if (user.role === userChatRole.MEMBER || bannedBy.role === userChatRole.CREATOR) return;
    if (isNaN(Number(seconds))) return;
    const secondsNumber = Number(seconds);
    if (secondsNumber < 0) return;
    const bannedUntil = new Date();
    bannedUntil.setSeconds(bannedUntil.getSeconds() + secondsNumber);
    const bannedUser: IBannedUser = {
      ...user,
      bannedAt: new Date(),
      bannedBy,
      bannedUntil,
    };
    this.bannedUsers.push(bannedUser);
    this.removeUser(user);
    const { socket: userSocket, ...userWithoutSocket } = user;
    const { socket: bannedBySocket, ...bannedByWithoutSocket } = bannedBy;
    this.emitToUsers("userBanned", { channelId: this.id, user: userWithoutSocket, bannedBy: bannedByWithoutSocket, seconds })
  }

  muteUser(user: IChatUser, mutedBy: IChatUser, seconds: string): void {
    if (user.role === userChatRole.MEMBER || mutedBy.role === userChatRole.CREATOR) return;
    if (isNaN(Number(seconds))) return;
    const secondsNumber = Number(seconds);
    if (secondsNumber < 0) return;
    const mutedUntil = new Date();
    mutedUntil.setSeconds(mutedUntil.getSeconds() + secondsNumber);
    const mutedUser: IMutedUser = {
      ...user,
      mutedAt: new Date(),
      mutedBy,
      mutedUntil,
    };
    this.mutedUsers.push(mutedUser);
    const { socket: userSocket, ...userWithoutSocket } = user;
    const { socket: mutedBySocket, ...mutedByWithoutSocket } = mutedBy;
    this.emitToUsers("userMuted", { channelId: this.id, user: userWithoutSocket, mutedBy: mutedByWithoutSocket, seconds })
  }

  unmuteUser(user: IChatUser, unmutedBy: IChatUser): void {
    if (user.role === userChatRole.MEMBER) return;
    const mutedUser = this.mutedUsers.find((u) => u.id === user.id);
    if (!mutedUser) return;
    this.mutedUsers = this.mutedUsers.filter((u) => u.id !== user.id);
    const { socket: userSocket, ...userWithoutSocket } = user;
    const { socket: unmutedBySocket, ...unmutedByWithoutSocket } = unmutedBy;
    this.emitToUsers("userUnmuted", { channelId: this.id, user: userWithoutSocket, unmutedBy: unmutedByWithoutSocket })
  }

  unbanUser(user: IChatUser, unbannedBy: IChatUser): void {
    if (user.role === userChatRole.MEMBER) return;
    const bannedUser = this.bannedUsers.find((u) => u.id === user.id);
    if (!bannedUser) return;
    this.bannedUsers = this.bannedUsers.filter((u) => u.id !== user.id);
    const { socket: userSocket, ...userWithoutSocket } = user;
    const { socket: unbannedBySocket, ...unbannedByWithoutSocket } = unbannedBy;
    this.emitToUsers("userUnbanned", { channelId: this.id, user: userWithoutSocket, unbannedBy: unbannedByWithoutSocket })
  }

	addMessage(message: IMessage): void {
    const mutedUser = this.mutedUsers.find((u) => u.id === message.sender.id);
    if (mutedUser)
    {
      if (mutedUser.mutedUntil > new Date()) return;
      else this.mutedUsers = this.mutedUsers.filter((u) => u.id !== message.sender.id);
    }
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
    if (this.users.find((u) => u.id === user.id)) return;
    const bannedUser = this.bannedUsers.find((u) => u.id === user.id);
    if (bannedUser)
    {
      if (bannedUser.bannedUntil > new Date()) return;
      else this.bannedUsers = this.bannedUsers.filter((u) => u.id !== user.id);
    }
		this.users.push(user);
		this.emitToUsers("userJoined", {channelId: this.id, user: { id: user.id, name: user.name } })
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
