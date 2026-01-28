"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const util_1 = require("util");
const jsonwebtoken_1 = require("jsonwebtoken");
const knex_1 = require("../database/knex");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AuthService = class AuthService {
    async hashPassword(password) {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const derived = (await scrypt(password, salt, 64));
        return `${salt}:${derived.toString('hex')}`;
    }
    async verifyPassword(password, stored) {
        const [salt, hash] = stored.split(':');
        if (!salt || !hash)
            return false;
        const derived = (await scrypt(password, salt, 64));
        const hashBuffer = Buffer.from(hash, 'hex');
        if (hashBuffer.length !== derived.length)
            return false;
        return (0, crypto_1.timingSafeEqual)(hashBuffer, derived);
    }
    signToken(user) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new common_1.InternalServerErrorException('JWT_SECRET não configurado');
        }
        return jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, secret, {
            expiresIn: '7d',
        });
    }
    async register(dto) {
        const existing = await (0, knex_1.db)('users').where({ email: dto.email }).first();
        if (existing) {
            throw new common_1.BadRequestException('Email já cadastrado');
        }
        const passwordHash = await this.hashPassword(dto.password);
        const [id] = await (0, knex_1.db)('users').insert({
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
    async login(dto) {
        const user = await (0, knex_1.db)('users').where({ email: dto.email }).first();
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const ok = await this.verifyPassword(dto.password, user.password_hash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const token = this.signToken({ id: user.id, email: user.email });
        return {
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map