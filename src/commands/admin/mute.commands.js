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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteCommands = void 0;
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const mute_decorator_1 = require("./../../common/decorators/mute.decorator");
const mute_dto_1 = require("../dto/mute.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const mute_event_1 = require("../../common/events/mute.event");
const settings_service_1 = require("../../api/settings/settings.service");
const common_1 = require("@nestjs/common");
const ms_1 = __importDefault(require("ms"));
const permission_utils_1 = require("../../common/utils/permission.utils");
let MuteCommands = class MuteCommands {
    eventEmitter;
    settingsService;
    client;
    constructor(eventEmitter, settingsService, client) {
        this.eventEmitter = eventEmitter;
        this.settingsService = settingsService;
        this.client = client;
    }
    async muteTextSlash([interaction], options) {
        return this.processMute(interaction, options.user.id, options.time, options.reason, 'text', interaction.user.id);
    }
    async muteVoiceSlash([interaction], options) {
        return this.processMute(interaction, options.user.id, options.time, options.reason, 'voice', interaction.user.id);
    }
    async muteTextPrefix([message], args) {
        return this.handlePrefixMute(message, args, 'text');
    }
    async muteVoicePrefix([message], args) {
        return this.handlePrefixMute(message, args, 'voice');
    }
    async handlePrefixMute(message, args, type) {
        const targetId = message.mentions.users.first()?.id || args[0];
        if (!targetId)
            return message.reply('Please mention a user or provide an ID.');
        let time = undefined;
        let reason = args.slice(1).join(' ');
        if (args[1] && /^\d+[smhdwy]$/.test(args[1])) {
            time = args[1];
            reason = args.slice(2).join(' ');
        }
        return this.processMute(message, targetId, time, reason, type, message.author.id);
    }
    async processMute(context, targetId, manualTime, manualReason, type, moderatorId) {
        const guild = context.guild;
        if (!guild)
            return;
        const moderator = await guild.members.fetch(moderatorId).catch(() => null);
        const targetMember = await guild.members.fetch(targetId).catch(() => null);
        const botMember = guild.members.me;
        const settings = await this.settingsService.getGuildSettings(guild.id);
        const dbCommandName = `mute ${type}`;
        const fallbackPerm = type === 'text' ? discord_js_1.PermissionsBitField.Flags.ModerateMembers : discord_js_1.PermissionsBitField.Flags.MuteMembers;
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, dbCommandName, fallbackPerm);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        const cmdConfig = settings?.commands?.find((c) => c.name === dbCommandName);
        if (targetMember) {
            if (targetMember.roles.highest.position >= moderator.roles.highest.position && moderatorId !== guild.ownerId) {
                return context.reply({ content: 'You cannot mute someone with a higher or equal role.', flags: 64 });
            }
            if (botMember && targetMember.roles.highest.position >= botMember.roles.highest.position) {
                return context.reply({ content: 'I cannot mute this user due to role hierarchy.', flags: 64 });
            }
        }
        let finalTime = manualTime;
        const finalReason = manualReason;
        if (!manualTime && !manualReason && cmdConfig) {
            if (cmdConfig.defaultAction === 'time') {
                finalTime = `${cmdConfig.specificTime}${cmdConfig.specificUnit}`;
            }
            else if (cmdConfig.defaultAction === 'list_reason' && cmdConfig.reasons?.length > 0) {
                return this.showReasonMenu(context, targetId, moderatorId, cmdConfig.reasons, type, settings);
            }
        }
        return this.executeMute(context, targetId, moderatorId, finalTime, finalReason || `${type.charAt(0).toUpperCase() + type.slice(1)} Mute`, type, settings);
    }
    async showReasonMenu(context, targetId, moderatorId, reasons, type, settings) {
        const menu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(`mute_select_${context.id}`)
            .setPlaceholder('Select a mute reason')
            .addOptions(reasons.map(r => ({
            label: r.text,
            value: JSON.stringify({ r: r.text, t: r.time, u: r.unit }),
            description: r.time ? `Duration: ${r.time}${r.unit}` : 'Permanent'
        })));
        const row = new discord_js_1.ActionRowBuilder().addComponents(menu);
        const response = await context.reply({ content: 'Select a reason:', components: [row], flags: 64 });
        const collector = response.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            time: 60000,
            filter: i => i.user.id === moderatorId
        });
        collector.on('collect', async (i) => {
            const data = JSON.parse(i.values[0]);
            await response.delete();
            const timeStr = data.t ? `${data.t}${data.u}` : undefined;
            await this.executeMute(context, targetId, moderatorId, timeStr, data.r, type, settings);
            collector.stop();
        });
    }
    executeMute(context, targetId, moderatorId, timeStr, reason, type, settings) {
        const msValue = timeStr ? (0, ms_1.default)(timeStr) : (0, ms_1.default)("99y");
        const duration = typeof msValue === 'number' ? msValue : (0, ms_1.default)("99y");
        this.eventEmitter.emit('mute.created', new mute_event_1.MuteEvent(context.guildId, targetId, moderatorId, duration, reason, type));
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`${type === 'text' ? 'Text' : 'Voice'} Mute Applied`)
            .setColor('#7c5bbe')
            .setDescription(`**User:** <@${targetId}>\n**Reason:** ${reason}\n**Duration:** ${timeStr || '99y'}`)
            .setTimestamp();
        return context.editReply ? context.editReply({ embeds: [embed], content: '' }) : context.reply({ embeds: [embed] });
    }
};
exports.MuteCommands = MuteCommands;
__decorate([
    (0, necord_1.Subcommand)({ name: 'text', description: 'Mute member from text channels (Role based)', }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, mute_dto_1.MuteTextDto]),
    __metadata("design:returntype", Promise)
], MuteCommands.prototype, "muteTextSlash", null);
__decorate([
    (0, necord_1.Subcommand)({ name: 'voice', description: 'Server mute member from voice channels', }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, mute_dto_1.MuteVoiceDto]),
    __metadata("design:returntype", Promise)
], MuteCommands.prototype, "muteVoiceSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], MuteCommands.prototype, "muteTextPrefix", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], MuteCommands.prototype, "muteVoicePrefix", null);
exports.MuteCommands = MuteCommands = __decorate([
    (0, mute_decorator_1.MuteCommandDecorator)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        settings_service_1.SettingsService,
        discord_js_1.Client])
], MuteCommands);
//# sourceMappingURL=mute.commands.js.map