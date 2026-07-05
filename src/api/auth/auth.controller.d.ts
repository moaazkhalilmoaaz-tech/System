import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    showLoginPage(res: Response): void;
    login(loginDto: LoginDto, res: Response): Promise<void>;
    showGuildsPage(res: Response): void;
    logout(res: Response): void;
}
