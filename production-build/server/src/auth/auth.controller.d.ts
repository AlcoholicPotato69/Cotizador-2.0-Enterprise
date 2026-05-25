import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
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
    getProfile(req: any): any;
}
