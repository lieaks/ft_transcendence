import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TwoFactorAuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const skipTwoFactorAuth = this.reflector.get<boolean>('skipTwoFactorAuth', context.getHandler());
		if (skipTwoFactorAuth) return true;

		let request = context.switchToHttp().getRequest();
		if (!request) request = GqlExecutionContext.create(context).getContext().req;
		if (!request) request = context.switchToRpc().getContext().getRequest();
		if (!request) request = context.switchToWs().getData().req;

		const jwtToken = request.headers.authorization?.split(' ')[1];

		if (!jwtToken) {
			throw new UnauthorizedException('JWT token not found.');
		}

		const isTokenRequireTwoFactor = this.authService.isTokenRequireTwoFactor(jwtToken)
		return !isTokenRequireTwoFactor;
	}
}
