import { Request } from 'express';

export interface IRequestOauthUser extends Request {
	user: {
		id: string;
		twoFactorAuth: boolean;
		jwtToken: string;
	}
}
