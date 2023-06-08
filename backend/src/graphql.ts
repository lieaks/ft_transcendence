
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    name: string;
    avatar?: Nullable<string>;
}

export interface UpdateUserInput {
    name?: Nullable<string>;
    avatar?: Nullable<Byte>;
    friends?: Nullable<string[]>;
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
    game(id: string): Nullable<Game> | Promise<Nullable<Game>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
    userByName(name: string): Nullable<User> | Promise<Nullable<User>>;
    usersByIds(ids: string[]): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    users(): User[] | Promise<User[]>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createGame(userId: string, enemyUserId: string): Game | Promise<Game>;
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
