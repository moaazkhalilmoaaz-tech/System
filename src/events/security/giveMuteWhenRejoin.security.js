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
var GiveMuteWhenRejoinService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveMuteWhenRejoinService = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mute_entity_1 = require("./../../database/entities/mute.entity");
let GiveMuteWhenRejoinService = GiveMuteWhenRejoinService_1 = class GiveMuteWhenRejoinService {
    muteRepository;
    logger = new common_1.Logger(GiveMuteWhenRejoinService_1.name);
    constructor(muteRepository) {
        this.muteRepository = muteRepository;
    }
    MEMBER_ROLE_ID = '1333225938854477826';
    BOT_ROLE_ID = '1439329655793385675';
    async onMemberJoin([member]) {
        try {
            const roleId = member.user.bot ? this.BOT_ROLE_ID : this.MEMBER_ROLE_ID;
            const role = member.guild.roles.cache.get(roleId);
            if (role) {
                await member.roles.add(role, 'Autorole');
                this.logger.log(`Autorole: gave ${role.name} to ${member.user.tag}`);
            }
        }
        catch (e) {
            this.logger.warn(`Autorole failed for ${member.user.tag}: ${e?.message}`);
        }
        const activeMute = await this.muteRepository.findOne({
            where: {
                guildId: member.guild.id,
                userId: member.id,
                type: 'text',
                active: true,
                expiresAt: (0, typeorm_2.MoreThan)(new Date())
            }
        });
        const activeVoiceMute = await this.muteRepository.findOne({
            where: {
                guildId: member.guild.id,
                userId: member.id,
                type: 'voice',
                active: true,
                expiresAt: (0, typeorm_2.MoreThan)(new Date())
            }
        });
        if (activeVoiceMute) {
            await member.voice.setMute(true, 'Voice Mute Persistence').catch(() => null);
        }
        if (activeMute) {
            const muteRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
            if (muteRole) {
                await member.roles.add(muteRole, 'Mute Persistence (Rejoin)');
                this.logger.log(`Re-applied mute role to ${member.user.tag} upon rejoin.`);
            }
        }
    }
};
exports.GiveMuteWhenRejoinService = GiveMuteWhenRejoinService;
__decorate([
    (0, necord_1.On)('guildMemberAdd'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GiveMuteWhenRejoinService.prototype, "onMemberJoin", null);
exports.GiveMuteWhenRejoinService = GiveMuteWhenRejoinService = GiveMuteWhenRejoinService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mute_entity_1.Mute)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GiveMuteWhenRejoinService);
//# sourceMappingURL=giveMuteWhenRejoin.security.js.map