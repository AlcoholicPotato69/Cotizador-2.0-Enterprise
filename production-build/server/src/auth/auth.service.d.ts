import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    login(credentials: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            tenant_id: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: string[];
        };
    }>;
}
