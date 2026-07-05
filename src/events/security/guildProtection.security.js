"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GuildProtectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildProtectionService = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const configData = __importStar(require("./../../../config.js"));
const config = configData.default;
let GuildProtectionService = GuildProtectionService_1 = class GuildProtectionService {
    client;
    logger = new common_1.Logger(GuildProtectionService_1.name);
    ALLOWED_GUILDS_IDS = config.allowedServers;
    constructor(client) {
        this.client = client;
    }
    async onGuildJoin([guild]) {
        if (!this.ALLOWED_GUILDS_IDS.includes(guild.id)) {
            this.logger.warn(`Bot added to unauthorized guild: ${guild.name} (${guild.id}). Leaving...`);
            try {
                await guild.leave();
            }
            catch (error) {
                this.logger.error(`Failed to leave guild ${guild.name}: ${error.message}`);
            }
        }
    }
    onReady() {
        this.logger.log('Checking for unauthorized guilds...');
        this.client.guilds.cache.forEach(async (guild) => {
            if (!this.ALLOWED_GUILDS_IDS.includes(guild.id)) {
                this.logger.warn(`Found unauthorized guild on startup: ${guild.name} (${guild.id}). Leaving...`);
                try {
                    await guild.leave();
                }
                catch (error) {
                    this.logger.error(`Failed to leave guild ${guild.name}: ${error.message}`);
                }
            }
        });
    }
};
exports.GuildProtectionService = GuildProtectionService;
__decorate([
    (0, necord_1.On)('guildCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuildProtectionService.prototype, "onGuildJoin", null);
__decorate([
    (0, necord_1.Once)('clientReady'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuildProtectionService.prototype, "onReady", null);
exports.GuildProtectionService = GuildProtectionService = GuildProtectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client])
], GuildProtectionService);
//# sourceMappingURL=guildProtection.security.js.map