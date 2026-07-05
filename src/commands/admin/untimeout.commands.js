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
exports.UntimeoutCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const untimeout_dto_1 = require("./../dto/untimeout.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const permission_utils_1 = require("./../../common/utils/permission.utils");
let UntimeoutCommand = class UntimeoutCommand {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async onUntimeoutSlash([interaction], { member, reason }) {
        return this.processUntimeout(interaction, member, reason ?? 'No reason provided');
    }
    async onUntimeoutPrefix([message], args) {
        const target = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]).catch(() => null);
        if (!target) {
            return message.reply('Please specify a valid member.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';
        return this.processUntimeout(message, target, reason);
    }
    async processUntimeout(context, target, reason) {
        const guild = context.guild;
        if (!guild)
            return;
        const settings = await this.settingsService.getGuildSettings(guild.id);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'untimeout', discord_js_1.PermissionsBitField.Flags.ModerateMembers);
        if (!permCheck.allowed) {
            const response = { content: permCheck.message || 'Permission denied.', flags: 64 };
            return context.reply ? context.reply(response) : context.send(response);
        }
        if (!guild.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ModerateMembers)) {
            const msg = 'I do not have permission to timeout/untimeout members.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        if (!target.moderatable) {
            const msg = 'I cannot modify this user due to role hierarchy.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        if (!target.isCommunicationDisabled()) {
            const msg = 'This member is not currently timed out.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        try {
            await target.timeout(null, reason || 'No reason provided');
            const successMsg = `**${target.user.username}** has been untimed out. Reason: ${reason || 'None'}`;
            return context.reply ? context.reply({ content: successMsg }) : context.send(successMsg);
        }
        catch (error) {
            console.error(error);
            const errorMsg = 'An error occurred while trying to untimeout the member.';
            return context.reply ? context.reply({ content: errorMsg, flags: 64 }) : context.send(errorMsg);
        }
    }
};
exports.UntimeoutCommand = UntimeoutCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'untimeout',
        description: 'Remove timeout from a member',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, untimeout_dto_1.UntimeoutDto]),
    __metadata("design:returntype", Promise)
], UntimeoutCommand.prototype, "onUntimeoutSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], UntimeoutCommand.prototype, "onUntimeoutPrefix", null);
exports.UntimeoutCommand = UntimeoutCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], UntimeoutCommand);
//# sourceMappingURL=untimeout.commands.js.map