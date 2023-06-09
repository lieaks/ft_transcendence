
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface UpdateUserInput {
    name?: Nullable<string>;
    avatar?: Nullable<Byte>;
    friendsToAdd?: Nullable<string[]>;
    friendsToRemove?: Nullable<string[]>;
}

export interface Game {
    __typename?: 'Game';
    id: string;
    players: User[];
    winner?: Nullable<User>;
    looser?: Nullable<User>;
    createdAt: DateTime;
    finishedAt?: Nullable<DateTime>;
}

export interface IQuery {
    __typename?: 'IQuery';
    games(): Game[] | Promise<Game[]>;
    game(id: string): Game | Promise<Game>;
    getPlayersByGameId(id: string): User[] | Promise<User[]>;
    getCurrentGames(): Game[] | Promise<Game[]>;
    users(): User[] | Promise<User[]>;
    user(id: string): User | Promise<User>;
    ping(): Nullable<string> | Promise<Nullable<string>>;
    chirel(): Nullable<string> | Promise<Nullable<string>>;
    userByName(name: string): Nullable<User> | Promise<Nullable<User>>;
    usersByIds(ids: string[]): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createGame(userId: string, enemyUserId: string): Game | Promise<Game>;
    loveChirel(): Nullable<string> | Promise<Nullable<string>>;
    notLoveChirel(): Nullable<string> | Promise<Nullable<string>>;
    test(): Nullable<string> | Promise<Nullable<string>>;
    updateUser(input: UpdateUserInput): User | Promise<User>;
    submit2FA(token: string): boolean | Promise<boolean>;
    enable2FA(): string | Promise<string>;
    disable2FA(token: string): boolean | Promise<boolean>;
}

export interface User {
    __typename?: 'User';
    id: string;
    name: string;
    avatar: Byte;
    ladderRanking: number;
    experience: number;
    createdAt: DateTime;
    gameHistory?: Nullable<Game[]>;
    gamesWon?: Nullable<Game[]>;
    gamesLost?: Nullable<Game[]>;
    friends?: Nullable<User[]>;
    friendOf?: Nullable<User[]>;
    blocked?: Nullable<User[]>;
    blockedOf?: Nullable<User[]>;
}

export type DateTime = any;
export type Byte = any;
type Nullable<T> = T | null;
