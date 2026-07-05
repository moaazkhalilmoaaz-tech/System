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
exports.TimeoutCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const timeout_dto_1 = require("../dto/timeout.dto");
const settings_service_1 = require("../../api/settings/settings.service");
const ms_1 = __importDefault(require("ms"));
let TimeoutCommand = class TimeoutCommand {
    settingsService;
    MAX_TIMEOUT_MS = (0, ms_1.default)('28d');
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async onTimeoutSlash([interaction], { member, duration, reason }) {
        if (!interaction.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'I do not have permission to timeout members.', flags: 64 });
        }
        if (!member.moderatable) {
            return interaction.reply({ content: 'I cannot timeout this user due to role hierarchy.', flags: 64 });
        }
        if (!duration) {
            const settings = await this.settingsService.getGuildSettings(interaction.guildId || '');
            const config = settings?.commands?.find(c => c.name === "timeout");
            if (config) {
                if (config.defaultAction === 'time' && config.specificTime) {
                    const autoDuration = `${config.specificTime}${config.specificUnit}`;
                    const parsedMs = (0, ms_1.default)(autoDuration);
                    return this.executeTimeout(interaction, member, parsedMs, reason || 'Automatic Timeout');
                }
                else if (config.defaultAction === 'list_reason' && config.reasons?.length > 0) {
                    return this.showReasonMenu(interaction, member, config.reasons, interaction.user.id);
                }
            }
        }
        const timeInMs = duration ? (0, ms_1.default)(duration) : this.MAX_TIMEOUT_MS;
        if (!timeInMs || isNaN(timeInMs)) {
            return interaction.reply({ content: 'Invalid duration format.', flags: 64 });
        }
        return this.executeTimeout(interaction, member, timeInMs, reason || undefined);
    }
    async onTimeoutPrefix([message], args) {
        if (!message.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('I do not have permission to timeout members.');
        }
        const target = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]).catch(() => null);
        if (!target)
            return message.reply('Please specify a valid member.');
        if (!target.moderatable)
            return message.reply('I cannot timeout this user due to role hierarchy.');
        const potentialDuration = args[1];
        const parsed = potentialDuration ? (0, ms_1.default)(potentialDuration) : undefined;
        if (!parsed || isNaN(parsed)) {
            const settings = await this.settingsService.getGuildSettings(message.guildId || '');
            const config = settings?.commands?.find(c => c.name === "timeout");
            if (config) {
                if (config.defaultAction === 'time' && config.specificTime) {
                    const autoDuration = `${config.specificTime}${config.specificUnit}`;
                    const reason = args.slice(1).join(' ') || 'Automatic Timeout';
                    return this.executeTimeout(message, target, (0, ms_1.default)(autoDuration), reason);
                }
                else if (config.defaultAction === 'list_reason' && config.reasons?.length > 0) {
                    return this.showReasonMenu(message, target, config.reasons, message.author.id);
                }
            }
        }
        const timeInMs = parsed || this.MAX_TIMEOUT_MS;
        const finalReason = args.slice(parsed ? 2 : 1).join(' ') || 'No reason provided';
        return this.executeTimeout(message, target, timeInMs, finalReason);
    }
    async showReasonMenu(context, target, reasons, moderatorId) {
        const menu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(`timeout_select_${target.id}`)
            .setPlaceholder('Select a reason for timeout')
            .addOptions(reasons.map(r => ({
            label: r.text,
            value: JSON.stringify({ r: r.text, t: r.time, u: r.unit }),
            description: `Duration: ${r.time}${r.unit}`
        })));
        const row = new discord_js_1.ActionRowBuilder().addComponents(menu);
        const response = await context.reply({ content: `Select a reason to timeout **${target.user.username}**:`, components: [row], flags: 64 });
        const collector = response.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            time: 30000,
            filter: (i) => i.user.id === moderatorId
        });
        collector.on('collect', async (i) => {
            const data = JSON.parse(i.values[0]);
            const durationStr = `${data.t}${data.u}`;
            await response.delete();
            await this.executeTimeout(context, target, (0, ms_1.default)(durationStr), data.r);
            collector.stop();
        });
    }
    async executeTimeout(context, member, timeInMs, reason) {
        const finalTime = timeInMs > this.MAX_TIMEOUT_MS ? this.MAX_TIMEOUT_MS : timeInMs;
        try {
            await member.timeout(finalTime, reason || 'No reason provided');
            const durationLabel = (0, ms_1.default)(finalTime, { long: true });
            const content = `**${member.user.username}** has been timed out for **${durationLabel}**. Reason: ${reason || 'None'}`;
            return context.editReply ? context.editReply({ content }) : context.reply(content);
        }
        catch {
            const errorMsg = 'An error occurred while trying to timeout the member.';
            return context.editReply ? context.editReply({ content: errorMsg }) : context.reply(errorMsg);
        }
    }
};
exports.TimeoutCommand = TimeoutCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'timeout',
        description: 'Timeout a member',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, timeout_dto_1.TimeoutDto]),
    __metadata("design:returntype", Promise)
], TimeoutCommand.prototype, "onTimeoutSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], TimeoutCommand.prototype, "onTimeoutPrefix", null);
exports.TimeoutCommand = TimeoutCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], TimeoutCommand);
//# sourceMappingURL=timeout.commands.js.map