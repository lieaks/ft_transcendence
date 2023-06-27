import { Socket } from 'socket.io';
import { Status } from 'src/graphql';

enum userChatRole {
	ADMIN = "ADMIN",
	CREATOR = "CREATOR",
	MEMBER = "MEMBER",
}

interface IChatUser extends IUser {
	role: userChatRole;
}

interface IMutedUser extends IChatUser {
	mutedAt: Date;
	mutedBy: IChatUser;
	mutedUntil: Date;
}

interface IBannedUser extends IChatUser {
	bannedAt: Date;
	bannedBy: IChatUser;
	bannedUntil: Date;
}

export interface IUser {
  id: string;
  name?: string;
  socket: Socket;
  status: Status;

  addExperience(exp: number): Promise<number>;
  getStatus(): Promise<Status>;
}
export { Status, userChatRole, IChatUser, IMutedUser, IBannedUser };
