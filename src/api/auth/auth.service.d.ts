import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    private get adminSecret();
    signIn(key: string): Promise<string>;
    verify(token: string): Promise<any>;
}
