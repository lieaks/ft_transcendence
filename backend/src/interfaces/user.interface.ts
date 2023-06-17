import { Socket } from 'socket.io';
import { Status } from 'src/graphql';

export interface IUser {
  id: string;
  name?: string;
  socket: Socket;
  status: Status;

  addExperience(exp: number): Promise<number>;
  getStatus(): Promise<Status>;
}
export { Status };
