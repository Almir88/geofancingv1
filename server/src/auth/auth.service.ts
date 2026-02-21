import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto.email, dto.password, dto.name);
    return this.generateToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Neispravan email ili lozinka.');
    }
    const valid = await this.usersService.validatePassword(user, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Neispravan email ili lozinka.');
    }
    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
