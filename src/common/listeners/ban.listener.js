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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BanCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ban_entity_1 = require("../../database/entities/ban.entity");
const discord_js_1 = require("discord.js");
let BanCleanupService = BanCleanupService_1 = class BanCleanupService {
    client;
    banRepository;
    logger = new common_1.Logger(BanCleanupService_1.name);
    constructor(client, banRepository) {
        this.client = client;
        this.banRepository = banRepository;
    }
    async handleUnban() {
        const now = new Date();
        const expiredBans = await this.banRepository.find({
            where: { time: (0, typeorm_2.LessThanOrEqual)(now) }
        });
        if (expiredBans.length === 0)
            return;
        for (const banDoc of expiredBans) {
            try {
                const guild = await this.client.guilds.fetch(banDoc.guildId).catch(() => null);
                if (guild) {
                    await guild.members.unban(banDoc.member, 'Temporary ban expired').catch(err => {
                        if (err.code !== 10026) {
                            throw err;
                        }
                    });
                    this.logger.log(`Unbanned user ${banDoc.member} from guild ${guild.id}`);
                }
                await this.banRepository.delete({ id: banDoc.id });
            }
            catch (error) {
                this.logger.error(`Failed to unban user ${banDoc.member}: ${error.message}`);
                if (error.code === 10026 || error.code === 10013 || error.code === 50001) {
                    await this.banRepository.delete({ id: banDoc.id });
                }
            }
        }
    }
};
exports.BanCleanupService = BanCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BanCleanupService.prototype, "handleUnban", null);
exports.BanCleanupService = BanCleanupService = BanCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(ban_entity_1.Ban)),
    __metadata("design:paramtypes", [discord_js_1.Client,
        typeorm_2.Repository])
], BanCleanupService);
//# sourceMappingURL=ban.listener.js.map