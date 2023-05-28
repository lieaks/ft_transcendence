
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

export interface CreateGameInput {
    players: string[];
}

export interface User {
    __typename?: 'User';
    id: string;
    name: string;
    avatar?: Nullable<string>;
    ladderRanking: number;
    experience: number;
    createdAt: string;
    doubleAuthToken?: Nullable<string>;
    wins: number;
    losses: number;
    gameHistory: Game[];
    friends: User[];
    friendOf: User[];
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
    getUser(id: string): Nullable<User> | Promise<Nullable<User>>;
    getUserByName(name: string): Nullable<User> | Promise<Nullable<User>>;
    getUsers(id?: Nullable<string[]>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    getAllUsers(): User[] | Promise<User[]>;
    getGame(id: string): Nullable<Game> | Promise<Nullable<Game>>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createUser(input: CreateUserInput): User | Promise<User>;
    updateUser(id: string, input: UpdateUserInput): User | Promise<User>;
    createGame(input: CreateGameInput): Game | Promise<Game>;
    inviteUserToGame(userId: string): Game | Promise<Game>;
    updateUserName(id: string, name: string): User | Promise<User>;
    updateUserAvatar(id: string, avatar: string): User | Promise<User>;
    enable2FA(id: string): string | Promise<string>;
    disable2FA(id: string): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
