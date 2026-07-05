"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const discord_module_1 = require("./discord/discord.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const auth_module_1 = require("./api/auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const settings_module_1 = require("./api/settings/settings.module");
const schedule_1 = require("@nestjs/schedule");
const cache_manager_1 = require("@nestjs/cache-manager");
const leveling_module_1 = require("./leveling/leveling.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.getOrThrow("DATABASE_URL"),
                    autoLoadEntities: true,
                    synchronize: true,
                    extra: {
                        max: 25,
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 10000,
                        acquireTimeoutMillis: 10000,
                    }
                })
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    global: true,
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 24 * 60 * 60 * 1000,
                max: 1000,
            }),
            auth_module_1.AuthModule,
            settings_module_1.SettingsModule,
            leveling_module_1.LevelingModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            discord_module_1.DiscordModule
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
