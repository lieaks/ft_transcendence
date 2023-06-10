import { Socket } from 'socket.io';

export enum userStatus {
  ONLINE,
  OFFLINE,
  IN_GAME,
}

export interface IUser {
  id: string;
  name?: string;
  socket: Socket;
  twoFactorNeeded: boolean; // if the client need to submit a code
  status: userStatus;

  addExperience(exp: number): Promise<number>;
}
