
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class UpdateUserInput {
    name?: Nullable<string>;
    avatar?: Nullable<Byte>;
    friendsToAdd?: Nullable<string[]>;
    friendsToRemove?: Nullable<string[]>;
}

export class Game {
    id: string;
    players: User[];
    winner?: Nullable<User>;
    looser?: Nullable<User>;
    createdAt: DateTime;
    finishedAt?: Nullable<DateTime>;
}

<<<<<<< HEAD
export interface IQuery {
    __typename?: 'IQuery';
    games(): Game[] | Promise<Game[]>;
    game(id: string): Game | Promise<Game>;
    getPlayersByGameId(id: string): User[] | Promise<User[]>;
<<<<<<< HEAD
    getCurrentGames(): Game[] | Promise<Game[]>;
    users(): User[] | Promise<User[]>;
    user(id: string): User | Promise<User>;
    ping(): Nullable<string> | Promise<Nullable<string>>;
    chirel(): Nullable<string> | Promise<Nullable<string>>;
<<<<<<< HEAD
=======
=======
    game(id: string): Nullable<Game> | Promise<Nullable<Game>>;
    ping(): Nullable<string> | Promise<Nullable<string>>;
    chirel(): Nullable<string> | Promise<Nullable<string>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
>>>>>>> 747ca03 (WIP implement sockets)
=======
    users(): User[] | Promise<User[]>;
    user(id: string): User | Promise<User>;
    ping(): Nullable<string> | Promise<Nullable<string>>;
    chirel(): Nullable<string> | Promise<Nullable<string>>;
>>>>>>> fe23d3f (Update schema)
>>>>>>> 778c1f5 (Update schema)
    userByName(name: string): Nullable<User> | Promise<Nullable<User>>;
<<<<<<< HEAD
    usersByIds(ids: string[]): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
<<<<<<< HEAD
=======
    users(): User[] | Promise<User[]>;
=======
    usersByIds(id?: Nullable<string[]>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
>>>>>>> fcb584e (Update schema)
>>>>>>> fe23d3f (Update schema)
}

export interface IMutation {
    __typename?: 'IMutation';
    createGame(userId: string, enemyUserId: string): Game | Promise<Game>;
<<<<<<< HEAD
    loveChirel(): Nullable<string> | Promise<Nullable<string>>;
    notLoveChirel(): Nullable<string> | Promise<Nullable<string>>;
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    loveChirel(): Nullable<string> | Promise<Nullable<string>>;
    notLoveChirel(): Nullable<string> | Promise<Nullable<string>>;
    createUser(input: CreateUserInput): User | Promise<User>;
    updateUser(id: string, input: UpdateUserInput): User | Promise<User>;
    enable2FA(id: string): string | Promise<string>;
    disable2FA(id: string): boolean | Promise<boolean>;
    verify2FA(id: string, code: string): boolean | Promise<boolean>;
=======
=======
>>>>>>> 747ca03 (WIP implement sockets)
=======
>>>>>>> cd91218 (Mutation works)
>>>>>>> 7b8ff66 (Mutation works)
    updateUser(input: UpdateUserInput): User | Promise<User>;
    submit2FA(token: string): boolean | Promise<boolean>;
    enable2FA(): string | Promise<string>;
    disable2FA(token: string): boolean | Promise<boolean>;
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 904e72c (backend: all user resolver created. need to have the auth system to finish it)
=======
=======
    loveChirel(): Nullable<boolean> | Promise<Nullable<boolean>>;
    notLoveChirel(): Nullable<boolean> | Promise<Nullable<boolean>>;
=======
    loveChirel(): Nullable<string> | Promise<Nullable<string>>;
    notLoveChirel(): Nullable<string> | Promise<Nullable<string>>;
>>>>>>> 622e01e (Mutation works)
    createUser(input: CreateUserInput): User | Promise<User>;
    updateUser(id: string, input: UpdateUserInput): User | Promise<User>;
    enable2FA(id: string): string | Promise<string>;
    disable2FA(id: string): boolean | Promise<boolean>;
    verify2FA(id: string, code: string): boolean | Promise<boolean>;
>>>>>>> 04f80e6 (WIP implement sockets)
>>>>>>> 747ca03 (WIP implement sockets)
>>>>>>> 7b8ff66 (Mutation works)
=======
export abstract class IQuery {
    abstract games(): Game[] | Promise<Game[]>;

    abstract game(id: string): Game | Promise<Game>;

    abstract getPlayersByGameId(id: string): User[] | Promise<User[]>;

    abstract getCurrentGames(): Game[] | Promise<Game[]>;

    abstract users(): User[] | Promise<User[]>;

    abstract user(id: string): User | Promise<User>;

    abstract ping(): Nullable<string> | Promise<Nullable<string>>;

    abstract chirel(): Nullable<string> | Promise<Nullable<string>>;

    abstract userByName(name: string): Nullable<User> | Promise<Nullable<User>>;

    abstract usersByIds(ids: string[]): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
}

export abstract class IMutation {
    abstract createGame(userId: string, enemyUserId: string): Game | Promise<Game>;

    abstract loveChirel(): Nullable<string> | Promise<Nullable<string>>;

    abstract notLoveChirel(): Nullable<string> | Promise<Nullable<string>>;

    abstract test(): Nullable<string> | Promise<Nullable<string>>;

    abstract updateUser(input: UpdateUserInput): User | Promise<User>;

    abstract submit2FA(token: string): boolean | Promise<boolean>;

    abstract enable2FA(): string | Promise<string>;

    abstract disable2FA(token: string): boolean | Promise<boolean>;
>>>>>>> 9670b2f (Update the graphql.ts)
}

export class User {
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
