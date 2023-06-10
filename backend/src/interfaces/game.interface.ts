import { User } from '../users/user';

export enum gameStatus {
	WAITING,
	PLAYING,
	ENDED
}

export interface IGame {
	id: string;
	status: gameStatus;
	players: User[];
	createdAt: Date;

	addPlayer(player: User): void;
	removePlayer(player: User): void;
	create(): Promise<void>;
	finish(winner: User, loser: User): Promise<void>;
}
