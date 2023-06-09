import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  generateJwtToken(profile: any): string {
    const payload = { sub: profile.id, name: profile.name }; // Customize the payload as per your requirements
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  }
}
