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
	ball: { x: number; y: number; dx: number; dy: number };

	addPlayer(player: IUser): void;
	update(): void;
	updateScore(): void;
	reset(): void;
	removePlayer(player: IUser): void;
	create(): Promise<void>;
	finish(): Promise<void>;
	emitToPlayers(event: string, data: any): void;
	movePaddle(player: IUser, direction: string): void;
}
