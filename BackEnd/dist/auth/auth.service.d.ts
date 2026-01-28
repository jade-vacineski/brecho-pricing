import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private hashPassword;
    private verifyPassword;
    private signToken;
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
        };
    }>;
}
