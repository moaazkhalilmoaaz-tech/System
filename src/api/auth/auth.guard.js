"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const public_decorator_1 = require("./public.decorator");
let AuthGuard = class AuthGuard {
    jwtService;
    reflector;
    configService;
    constructor(jwtService, reflector, configService) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.configService = configService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = request.cookies['access_token'];
        if (!token) {
            response.redirect('/');
            return false;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            const allowedKeys = [
                'فارجمنت الباشا و هيثم يسطاوي',
                'HykYUr6Fa4CXG@4RtN'
            ];
            const fingerprints = allowedKeys.map(k => (0, crypto_1.createHash)('sha256').update(k).digest('hex'));
            if (!fingerprints.includes(payload.keyVersion)) {
                throw new common_1.UnauthorizedException('Key rotated/changed');
            }
            request['user'] = payload;
        }
        catch (e) {
            response.clearCookie('access_token');
            response.redirect('/');
            return false;
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        config_1.ConfigService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map