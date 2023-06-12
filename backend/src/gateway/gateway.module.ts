import { Module, forwardRef } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AppModule } from 'src/app.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
	imports: [
		forwardRef(() => AppModule),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1d' },
		}),
	],
	providers: [MyGateway],
})
export class GatewayModule {}
