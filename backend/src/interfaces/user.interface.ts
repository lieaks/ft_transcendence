import { Socket } from 'socket.io';
import { Status } from 'src/graphql';

export interface IUser {
  id: string;
  name?: string;
  socket: Socket;
  twoFactorNeeded: boolean; // if the client need to submit a code
  status: Status;

  addExperience(exp: number): Promise<number>;
}
export { Status };
