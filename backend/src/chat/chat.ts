import { IChat, IMessage, chatType } from 'src/interfaces/chat.interface';
import {
  IChatUser,
  IBannedUser,
  IMutedUser,
  userChatRole,
} from 'src/interfaces/user.interface';

export class Chat implements IChat {
  id: string;
  name: string;
  type: chatType;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: IMessage[];
  users: IChatUser[];
  mutedUsers: IMutedUser[];
  bannedUsers: IBannedUser[];

  constructor(id: string, name: string, type: chatType) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.password = undefined;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.messages = [];
    this.users = [];
    this.mutedUsers = [];
    this.bannedUsers = [];
  }

  kickUser(user: IChatUser, kickedBy: IChatUser): boolean {
    if (
      user.role === userChatRole.CREATOR ||
      kickedBy.role === userChatRole.MEMBER
    )
      return false;
    if (this.users.find((u) => u.id === user.id)) {
      const kickMessage: IMessage = {
        sender: kickedBy,
        content: `kicked ${user.name} from the chat`,
        createdAt: new Date(),
      };
      this.addMessage(kickMessage);
      this.removeUser(user);
      return true;
    }
    return false;
  }

  banUser(user: IChatUser, bannedBy: IChatUser, seconds: string): boolean {
    if (
      user.role === userChatRole.CREATOR ||
      bannedBy.role === userChatRole.MEMBER
    )
      return false;
    if (isNaN(Number(seconds))) return false;
    const secondsNumber = Number(seconds);
    if (secondsNumber < 0) return false;
    const bannedUntil = new Date();
    bannedUntil.setSeconds(bannedUntil.getSeconds() + secondsNumber);
    const bannedUser: IBannedUser = {
      ...user,
      bannedAt: new Date(),
      bannedBy,
      bannedUntil,
    };
    this.bannedUsers.push(bannedUser);
    const banMessage: IMessage = {
      sender: bannedBy,
      content: `banned ${user.name} from the chat`,
      createdAt: new Date(),
    };
    this.addMessage(banMessage);
    this.removeUser(user);
    return true;
  }

  muteUser(user: IChatUser, mutedBy: IChatUser, seconds: string): boolean {
    if (
      user.role === userChatRole.CREATOR ||
      mutedBy.role === userChatRole.MEMBER
    )
      return false;
    if (isNaN(Number(seconds))) return false;
    const secondsNumber = Number(seconds);
    if (secondsNumber < 0) return false;
    const mutedUntil = new Date();
    mutedUntil.setSeconds(mutedUntil.getSeconds() + secondsNumber);
    const mutedUser: IMutedUser = {
      ...user,
      mutedAt: new Date(),
      mutedBy,
      mutedUntil,
    };
    const muteMessage: IMessage = {
      sender: mutedBy,
      content: `muted ${user.name} from the chat`,
      createdAt: new Date(),
    };
    this.addMessage(muteMessage);
    this.mutedUsers.push(mutedUser);
    return true
  }

  unmuteUser(user: IChatUser, unmutedBy: IChatUser): boolean {
    if (unmutedBy.role === userChatRole.MEMBER) return false;
    const mutedUser = this.mutedUsers.find((u) => u.id === user.id);
    if (!mutedUser) return false;
    this.mutedUsers = this.mutedUsers.filter((u) => u.id !== user.id);
    const unmuteMessage: IMessage = {
      sender: unmutedBy,
      content: `unmuted ${user.name} from the chat`,
      createdAt: new Date(),
    };
    this.addMessage(unmuteMessage);
    return true;
  }

  deopUser(user: IChatUser, deopBy: IChatUser): boolean {
    if (deopBy.role === userChatRole.MEMBER) return false;
    if (user.role !== userChatRole.CREATOR) return false;
    const opMessage: IMessage = {
      sender: deopBy,
      content: `deoped ${user.name} from the chat`,
      createdAt: new Date(),
    };
    this.addMessage(opMessage);
    return true;
  }

  // unbanUser(user: IChatUser, unbannedBy: IChatUser): void {
  //   if (user.role === userChatRole.MEMBER) return;
  //   const bannedUser = this.bannedUsers.find((u) => u.id === user.id);
  //   if (!bannedUser) return;
  //   this.bannedUsers = this.bannedUsers.filter((u) => u.id !== user.id);
  //   // const { socket: userSocket, ...userWithoutSocket } = user;
  //   // const { socket: unbannedBySocket, ...unbannedByWithoutSocket } = unbannedBy;
  //   // this.emitToUsers('userUnbanned', {
  //     // channelId: this.id,
  //     // user: userWithoutSocket,
  //     // unbannedBy: unbannedByWithoutSocket,
  //   // });
  // }

  addMessage(message: IMessage): void {
    const mutedUser = this.mutedUsers.find((u) => u.id === message.sender.id);
    if (mutedUser) {
      if (mutedUser.mutedUntil > new Date()) return;
      else
        this.mutedUsers = this.mutedUsers.filter(
          (u) => u.id !== message.sender.id,
        );
    }
    if (!this.users.find((u) => u.id === message.sender.id)) return;
    this.updatedAt = new Date();
    this.messages.push(message);
    this.emitToUsers('newMessage', {
      channelId: this.id,
      message: {
        sender: {
          id: message.sender.id,
          name: message.sender.name,
        },
        content: message.content,
      },
    });
  }

  addUser(user: IChatUser, password?: string): void {
    if (this.type === chatType.PROTECTED && password && password !== this.password) return;
    if (this.password && this.password !== password) return;
    if (this.users.find((u) => u.id === user.id)) return;
    const bannedUser = this.bannedUsers.find((u) => u.id === user.id);
    if (bannedUser) {
      if (bannedUser.bannedUntil > new Date()) return;
      else this.bannedUsers = this.bannedUsers.filter((u) => u.id !== user.id);
    }
    this.users.push(user);
    this.emitToUsers('userJoined', {
      channelId: this.id,
      user: { id: user.id, name: user.name },
    });
    this.sendChannelInfo(user);
  }

  setPassword(password: string): void {
    if (this.type === chatType.PUBLIC)
      this.type = chatType.PROTECTED;
    this.password = password;
  }

  removeUser(user: IChatUser): void {
    if (this.users.find((u) => u.id === user.id)) {
      const userKick = { id: user.id, name: user.name };
      this.emitToUsers('userLeft', {
        channelId: this.id,
        user: userKick,
      });
      this.users = this.users.filter((u) => u.id !== user.id);
    }
  }

  getUserById(id: string): IChatUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  sendInfoToEveryone(): void {
    for (const user of this.users) {
      this.sendChannelInfo(user);
    }
  }

  sendChannelInfo(user: IChatUser): void {
    const messages = this.messages.map((m) => ({
      sender: { id: m.sender.id, name: m.sender.name },
      content: m.content,
    }));
    const users = this.users.map((u) => ({ id: u.id, name: u.name }));
    user.socket.emit('channelInfo', {
      channelId: this.id,
      messages,
      users,
      type: this.type,
    });
  }

  opUser(user: IChatUser, opBy: IChatUser): boolean {
    if (user.role === userChatRole.CREATOR || opBy.role !== userChatRole.CREATOR) return false;
    user.role = userChatRole.ADMIN;
    const opMessage: IMessage = {
      sender: opBy,
      content: `opped ${user.name}`,
      createdAt: new Date(),
    };
    this.addMessage(opMessage);
    return true;
  }

  changePassword(user: IChatUser, password: string): boolean {
    if (user.role !== userChatRole.CREATOR) return false;
    if (this.type === chatType.PUBLIC)
      this.type = chatType.PROTECTED;
    else if (this.type === chatType.PROTECTED && password === "") {
      this.password = "";
      this.type = chatType.PUBLIC;
    }
    if (this.type === chatType.PROTECTED)
      this.password = password;
    this.sendInfoToEveryone();
    return true;
  }

  emitToUsers(event: string, data: any): void {
    for (const user of this.users) {
      user.socket.emit(event, data);
    }
  }
}
