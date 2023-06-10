import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FortyTwoStrategy } from './forty-two.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
		forwardRef(() => AppModule),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    FortyTwoStrategy,
    GoogleStrategy,
    AuthService,
  ],
})
export class AuthModule {}
