// import { User } from '../users/user';
import { IUser } from "./user.interface";

export enum gameStatus {
	WAITING,
	PLAYING,
	ENDED
}

export interface IGame {
	id: string;
	status: gameStatus;
	players: IUser[];
	createdAt: Date;

	addPlayer(player: IUser): void;
	removePlayer(player: IUser): void;
	create(): Promise<void>;
	finish(winner: IUser, loser: IUser): Promise<void>;
}
