"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const discord_js_1 = require("discord.js");
const necord_1 = require("necord");
const commands_module_1 = require("../commands/commands.module");
const pagination_1 = require("@necord/pagination");
const events_module_1 = require("../events/events.module");
const guilds_controller_1 = require("../api/guilds/guilds.controller");
const guilds_service_1 = require("../api/guilds/guilds.service");
const auth_module_1 = require("../api/auth/auth.module");
const settings_module_1 = require("../api/settings/settings.module");
const settings_service_1 = require("../api/settings/settings.service");
let DiscordModule = class DiscordModule {
};
exports.DiscordModule = DiscordModule;
exports.DiscordModule = DiscordModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            necord_1.NecordModule.forRootAsync({
                imports: [config_1.ConfigModule, settings_module_1.SettingsModule],
                inject: [config_1.ConfigService, settings_service_1.SettingsService],
                useFactory: (configService, settingsService) => ({
                    token: configService.getOrThrow('BOT_TOKEN'),
                    rest: {
                        timeout: 30000,
                        retries: 5,
                    },
                    intents: [
                        discord_js_1.GatewayIntentBits.Guilds,
                        discord_js_1.GatewayIntentBits.GuildMessages,
                        discord_js_1.GatewayIntentBits.MessageContent,
                        discord_js_1.GatewayIntentBits.DirectMessages,
                        discord_js_1.GatewayIntentBits.GuildVoiceStates,
                        discord_js_1.GatewayIntentBits.GuildMembers,
                        discord_js_1.GatewayIntentBits.GuildPresences
                    ],
                    presence: {
                        status: 'dnd'
                    },
                    "settingsService": settingsService,
                    prefix: async (message) => {
                        if (!message.guildId)
                            return '!';
                        const settings = await settingsService.getGuildSettings(message.guildId);
                        return settings?.prefix || '!';
                    }
                }),
            }),
            pagination_1.NecordPaginationModule.forRoot({
                buttons: {
                    back: {
                        style: discord_js_1.ButtonStyle.Secondary
                    },
                    next: {
                        style: discord_js_1.ButtonStyle.Secondary
                    }
                },
                allowSkip: false,
                allowTraversal: false,
                buttonsPosition: "start"
            }),
            commands_module_1.CommandsModule,
            events_module_1.EventsModule,
            auth_module_1.AuthModule
        ],
        controllers: [guilds_controller_1.GuildsController],
        providers: [guilds_service_1.GuildsService]
    })
], DiscordModule);
//# sourceMappingURL=discord.module.js.map