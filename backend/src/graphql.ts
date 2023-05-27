
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    __typename?: 'IQuery';
    Users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    User(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
    __typename?: 'User';
    id: number;
    name: string;
}

type Nullable<T> = T | null;
