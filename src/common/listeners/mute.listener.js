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
var MuteListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discord_js_1 = require("discord.js");
const schedule_1 = require("@nestjs/schedule");
const mute_event_1 = require("../events/mute.event");
const mute_entity_1 = require("./../../database/entities/mute.entity");
let MuteListener = MuteListener_1 = class MuteListener {
    client;
    muteRepository;
    logger = new common_1.Logger(MuteListener_1.name);
    constructor(client, muteRepository) {
        this.client = client;
        this.muteRepository = muteRepository;
    }
    async handleMuteEvent(payload) {
        const guild = this.client.guilds.cache.get(payload.guildId);
        if (!guild)
            return;
        const member = await guild.members.fetch(payload.userId).catch(() => null);
        if (!member)
            return;
        try {
            if (payload.type === 'text') {
                const muteRole = await this.getOrCreateMuteRole(guild);
                await member.roles.add(muteRole, payload.reason);
            }
            else if (payload.type === 'voice') {
                await member.voice.setMute(true, payload.reason).catch(err => {
                    this.logger.warn(`Could not voice mute ${member.user.tag}: ${err.message}`);
                });
            }
            const mute = this.muteRepository.create({
                guildId: payload.guildId,
                userId: payload.userId,
                expiresAt: new Date(Date.now() + payload.duration),
                type: payload.type,
                active: true,
            });
            await this.muteRepository.save(mute);
            this.logger.log(`${payload.type.toUpperCase()} Muted user ${member.user.tag} in ${guild.name}`);
        }
        catch (error) {
            this.logger.error(`Failed to apply mute: ${error.message}`);
        }
    }
    async checkExpiredMutes() {
        const expiredMutes = await this.muteRepository.find({
            where: {
                active: true,
                expiresAt: (0, typeorm_2.LessThanOrEqual)(new Date())
            }
        });
        if (expiredMutes.length === 0)
            return;
        this.logger.log(`Found ${expiredMutes.length} expired mutes. Processing removal...`);
        for (const mute of expiredMutes) {
            try {
                const guild = this.client.guilds.cache.get(mute.guildId);
                if (!guild) {
                    mute.active = false;
                    await this.muteRepository.save(mute);
                    continue;
                }
                const member = await guild.members.fetch(mute.userId).catch(() => null);
                if (mute.type === 'text') {
                    const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
                    if (member && muteRole) {
                        await member.roles.remove(muteRole, 'Mute duration expired');
                    }
                }
                else if (mute.type === 'voice') {
                    if (member) {
                        await member.voice.setMute(false, 'Mute duration expired').catch(() => null);
                    }
                }
                mute.active = false;
                await this.muteRepository.save(mute);
                this.logger.log(`Unmuted (${mute.type}) user ${mute.userId}`);
            }
            catch (err) {
                this.logger.error(`Error processing expiry for ${mute.userId}: ${err.message}`);
            }
        }
    }
    async getOrCreateMuteRole(guild) {
        let role = guild.roles.cache.find((r) => r.name.toLowerCase() === 'muted');
        if (!role) {
            try {
                role = await guild.roles.create({
                    name: 'Muted',
                    color: '#818386',
                    reason: 'Auto-created Muted Role for Bot System',
                    permissions: []
                });
                guild.channels.cache.forEach(async (channel) => {
                    if (channel.isTextBased() && !channel.isThread()) {
                        if (channel.manageable) {
                            await channel.permissionOverwrites.create(role, {
                                SendMessages: false,
                                AddReactions: false,
                                CreatePublicThreads: false,
                                CreatePrivateThreads: false,
                                Speak: false,
                            }).catch(() => this.logger.warn(`Could not set perms for channel ${channel.name}`));
                        }
                    }
                });
            }
            catch (error) {
                this.logger.error(`Failed to create Muted role: ${error.message}`);
                throw error;
            }
        }
        return role;
    }
    ;
};
exports.MuteListener = MuteListener;
__decorate([
    (0, event_emitter_1.OnEvent)('mute.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mute_event_1.MuteEvent]),
    __metadata("design:returntype", Promise)
], MuteListener.prototype, "handleMuteEvent", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MuteListener.prototype, "checkExpiredMutes", null);
exports.MuteListener = MuteListener = MuteListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(mute_entity_1.Mute)),
    __metadata("design:paramtypes", [discord_js_1.Client,
        typeorm_2.Repository])
], MuteListener);
//# sourceMappingURL=mute.listener.js.map