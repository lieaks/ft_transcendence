import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateJwtToken(profile: any): Promise<string> {
    const payload = { sub: profile.id, name: profile.name };
    const token = this.jwtService.signAsync(payload);
    return token;
  }
}
