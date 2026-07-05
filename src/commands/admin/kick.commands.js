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
exports.KickCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const kick_dto_1 = require("./../dto/kick.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const permission_utils_1 = require("./../../common/utils/permission.utils");
let KickCommand = class KickCommand {
    client;
    settingsService;
    constructor(client, settingsService) {
        this.client = client;
        this.settingsService = settingsService;
    }
    async onKickSlash([interaction], { user, reason }) {
        return this.processKick(interaction, user.id, reason);
    }
    async onKickPrefix([message], args) {
        const targetId = message.mentions.users.first()?.id || args[0];
        if (!targetId)
            return message.reply('Please specify a valid member.');
        const reason = args.slice(1).join(' ');
        return this.processKick(message, targetId, reason);
    }
    async processKick(context, targetId, reason) {
        if (!context.guildId)
            return;
        const settings = await this.settingsService.getGuildSettings(context.guildId);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'kick', discord_js_1.PermissionsBitField.Flags.KickMembers);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        const guild = context.guild;
        if (!guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.KickMembers)) {
            const msg = 'I do not have permission to kick members.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        const member = await guild.members.fetch(targetId).catch(() => null);
        if (!member) {
            const msg = 'Member not found.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        if (!member.kickable) {
            const msg = 'I cannot kick this member due to role hierarchy.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        try {
            await member.kick(reason || 'No reason provided');
            const successMsg = `Successfully kicked **${member.user.tag}**`;
            return context.reply ? context.reply({ content: successMsg }) : context.send(successMsg);
        }
        catch {
            const errorMsg = 'Could not kick the member.';
            return context.reply ? context.reply({ content: errorMsg, flags: 64 }) : context.send(errorMsg);
        }
    }
};
exports.KickCommand = KickCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'kick',
        description: 'Kick a member from the server',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, kick_dto_1.KickDto]),
    __metadata("design:returntype", Promise)
], KickCommand.prototype, "onKickSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], KickCommand.prototype, "onKickPrefix", null);
exports.KickCommand = KickCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client,
        settings_service_1.SettingsService])
], KickCommand);
//# sourceMappingURL=kick.commands.js.map