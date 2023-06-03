
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
    avatar?: Nullable<string>;
    friends?: Nullable<string[]>;
}

export interface Game {
    __typename?: 'Game';
    id: string;
    players: User[];
    winnerId?: Nullable<string>;
    createdAt: string;
    finishedAt?: Nullable<string>;
}

export interface IQuery {
    __typename?: 'IQuery';
    game(id: string): Nullable<Game> | Promise<Nullable<Game>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
    userName(name: string): Nullable<User> | Promise<Nullable<User>>;
    users(id?: Nullable<string[]>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    allUsers(): User[] | Promise<User[]>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createGame(userId: string, enemyUserId: string): Game | Promise<Game>;
    createUser(input: CreateUserInput): User | Promise<User>;
    updateUser(id: string, input: UpdateUserInput): User | Promise<User>;
    enable2FA(id: string): string | Promise<string>;
    disable2FA(id: string): boolean | Promise<boolean>;
    verify2FA(id: string, code: string): boolean | Promise<boolean>;
}

export interface User {
    __typename?: 'User';
    id: string;
    name: string;
    avatar: string;
    ladderRanking: number;
    experience: number;
    createdAt: string;
    wins: number;
    losses: number;
    gameHistory?: Nullable<Game[]>;
    friends?: Nullable<User[]>;
    friendOf?: Nullable<User[]>;
}

type Nullable<T> = T | null;
