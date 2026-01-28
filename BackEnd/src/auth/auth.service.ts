import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { db } from '../database/knex';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const scrypt = promisify(_scrypt);

type DbUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
};

@Injectable()
export class AuthService {
  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derived.toString('hex')}`;
  }

  private async verifyPassword(password: string, stored: string) {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    const hashBuffer = Buffer.from(hash, 'hex');
    if (hashBuffer.length !== derived.length) return false;
    return timingSafeEqual(hashBuffer, derived);
  }

  private signToken(user: { id: number; email: string }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET não configurado');
    }
    return jwt.sign({ sub: user.id, email: user.email }, secret, {
      expiresIn: '7d',
    });
  }

  async register(dto: RegisterDto) {
    const existing = await db<DbUser>('users').where({ email: dto.email }).first();
    if (existing) {
      throw new BadRequestException('Email já cadastrado');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const [id] = await db('users').insert({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password_hash: passwordHash,
    });

    const token = this.signToken({ id, email: dto.email });

    return {
      token,
      user: { id, name: dto.name, email: dto.email, phone: dto.phone },
    };
  }

  async login(dto: LoginDto) {
    const user = await db<DbUser>('users').where({ email: dto.email }).first();
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const ok = await this.verifyPassword(dto.password, user.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.signToken({ id: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    };
  }
}
