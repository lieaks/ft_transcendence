export enum chatType {
  PUBLIC,
  PROTECTED,
  PRIVATE
}
export enum chatRole {
  CREATOR,
  ADMIN,
  MEMBER
}
export interface IUser {
  id: string
  name: string
  role: chatRole
  blocked: boolean
  friend: boolean
}
export interface IMessage {
  sender: IUser
  content: string
}
export interface IChannel {
  id: string
  name: string
  type: chatType
  users: IUser[]
  messages: IMessage[]
}
