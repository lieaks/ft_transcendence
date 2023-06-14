import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateJwtToken(user: User): Promise<string> {
    const payload = { id: user.id, name: user.name };
    const token = this.jwtService.signAsync(payload);
    return token;
  }
}
