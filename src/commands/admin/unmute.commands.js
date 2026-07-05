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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmuteCommands = void 0;
const necord_1 = require("necord");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discord_js_1 = require("discord.js");
const unmute_dto_1 = require("../dto/unmute.dto");
const mute_entity_1 = require("../../database/entities/mute.entity");
const unmute_decorator_1 = require("../../common/decorators/unmute.decorator");
const settings_service_1 = require("../../api/settings/settings.service");
const common_1 = require("@nestjs/common");
let UnmuteCommands = class UnmuteCommands {
    muteRepository;
    settingsService;
    constructor(muteRepository, settingsService) {
        this.muteRepository = muteRepository;
        this.settingsService = settingsService;
    }
    async unmuteTextSlash([interaction], { member, reason }) {
        return this.processUnmute(interaction, member.id, reason, 'text', interaction.user.id);
    }
    async unmuteVoiceSlash([interaction], { member, reason }) {
        return this.processUnmute(interaction, member.id, reason, 'voice', interaction.user.id);
    }
    async unmuteTextPrefix([message], args) {
        const targetId = message.mentions.users.first()?.id || args[0];
        const reason = args.slice(1).join(' ');
        return this.processUnmute(message, targetId, reason, 'text', message.author.id);
    }
    async unmuteVoicePrefix([message], args) {
        const targetId = message.mentions.users.first()?.id || args[0];
        const reason = args.slice(1).join(' ');
        return this.processUnmute(message, targetId, reason, 'voice', message.author.id);
    }
    async processUnmute(context, targetId, reason, type, moderatorId) {
        const guild = context.guild;
        if (!guild)
            return;
        if (!targetId)
            return context.reply({ content: 'Please provide a valid user ID or mention.', flags: 64 });
        const moderator = await guild.members.fetch(moderatorId).catch(() => null);
        const targetMember = await guild.members.fetch(targetId).catch(() => null);
        const reqPerm = type === 'text' ? discord_js_1.PermissionsBitField.Flags.ModerateMembers : discord_js_1.PermissionsBitField.Flags.MuteMembers;
        if (!moderator?.permissions.has(reqPerm)) {
            return context.reply({ content: `You need permission to unmute members.`, flags: 64 });
        }
        if (!targetMember)
            return context.reply({ content: 'Member not found in this server.', flags: 64 });
        if (moderator && targetMember.roles.highest.position >= moderator.roles.highest.position && moderatorId !== guild.ownerId) {
            return context.reply({ content: 'You cannot unmute someone with a higher or equal role.', flags: 64 });
        }
        try {
            const settings = await this.settingsService.getGuildSettings(guild.id);
            const finalReason = reason ?? `Unmuted by <@${moderatorId}>`;
            if (type === 'text') {
                const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
                if (muteRole && targetMember.roles.cache.has(muteRole.id)) {
                    await targetMember.roles.remove(muteRole, finalReason);
                }
            }
            else {
                await targetMember.voice.setMute(false, finalReason).catch(() => null);
            }
            await this.muteRepository.update({
                guildId: guild.id,
                userId: targetMember.id,
                type: type,
                active: true,
            }, { active: false });
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${type === 'text' ? 'Text' : 'Voice'} Unmute Applied`)
                .setColor(settings?.embedColor || '#00ff00')
                .setDescription(`**User:** <@${targetMember.id}>\n**Moderator:** <@${moderatorId}>\n**Reason:** ${finalReason}`)
                .setTimestamp();
            return context.reply({ embeds: [embed] });
        }
        catch (error) {
            return context.reply({ content: `Failed to unmute: ${error.message}`, flags: 64 });
        }
    }
};
exports.UnmuteCommands = UnmuteCommands;
__decorate([
    (0, necord_1.Subcommand)({ name: 'text', description: 'Unmute member from text channels', }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, unmute_dto_1.UnmuteDto]),
    __metadata("design:returntype", Promise)
], UnmuteCommands.prototype, "unmuteTextSlash", null);
__decorate([
    (0, necord_1.Subcommand)({ name: 'voice', description: 'Unmute member from voice channels', }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, unmute_dto_1.UnmuteDto]),
    __metadata("design:returntype", Promise)
], UnmuteCommands.prototype, "unmuteVoiceSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], UnmuteCommands.prototype, "unmuteTextPrefix", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], UnmuteCommands.prototype, "unmuteVoicePrefix", null);
exports.UnmuteCommands = UnmuteCommands = __decorate([
    (0, unmute_decorator_1.UnMuteCommandDecorator)(),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mute_entity_1.Mute)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        settings_service_1.SettingsService])
], UnmuteCommands);
//# sourceMappingURL=unmute.commands.js.map