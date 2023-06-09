import { User as prismaUser } from '@prisma/client';

export interface User extends prismaUser {
  doubleAuthNeeded?: boolean; // if the client need to submit a code
  jwtToken?: string; // the jwt token
  status?: string; // online, offline, in game
}
