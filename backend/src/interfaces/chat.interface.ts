import { IUser } from './user.interface';
import {
  IChatUser,
  IBannedUser,
  IMutedUser,
  userChatRole,
} from 'src/interfaces/user.interface';

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
  creatorId: string;
  name: string;
  type: chatType;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: IMessage[];
  users: IChatUser[];
  mutedUsers: IMutedUser[];
  bannedUsers: IBannedUser[];
  getUserById(id: string): IChatUser | undefined;
  addMessage(message: IMessage): void;
  addUser(user: IChatUser, password?: string): void;
  changePassword(user: IChatUser, password: string): boolean;
  removeUser(user: IUser): boolean;
  emitToUsers(event: string, data: any): void;
  kickUser(user: IChatUser, kickedBy: IChatUser): boolean;
  banUser(user: IChatUser, bannedBy: IChatUser, seconds: string): boolean;
  muteUser(user: IChatUser, mutedBy: IChatUser, seconds: string): boolean;
  opUser(user: IChatUser, opBy: IChatUser): boolean;
  unmuteUser(user: IChatUser, unmutedBy: IChatUser): boolean;
  deopUser(user: IChatUser, deopBy: IChatUser): boolean;
  deleteChannel(user: IChatUser): boolean;
}
