import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<User> {
    const { username, password } = registerInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.signAsync(payload)
    return {
      access_token: token,
    };
  }
}
