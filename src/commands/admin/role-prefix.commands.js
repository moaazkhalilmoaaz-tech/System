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
exports.RolePrefixHandler = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const settings_service_1 = require("./../../api/settings/settings.service");
let RolePrefixHandler = class RolePrefixHandler {
    settingService;
    constructor(settingService) {
        this.settingService = settingService;
    }
    async onMessageCreate([message]) {
        if (!message.guildId || message.author.bot || !message.content)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        const prefix = settings?.prefix || '!';
        const content = message.content.trim();
        const botId = message.client.user?.id;
        const botMention = botId ? `<@${botId}>` : null;
        const botNickMention = botId ? `<@!${botId}>` : null;
        let args = [];
        let usedPrefix = '';
        if (botMention && content.startsWith(botMention)) {
            usedPrefix = botMention;
        }
        else if (botNickMention && content.startsWith(botNickMention)) {
            usedPrefix = botNickMention;
        }
        else if (content.startsWith(prefix)) {
            usedPrefix = prefix;
        }
        else {
            return;
        }
        args = content.slice(usedPrefix.length).trim().split(/ +/g);
        const triggerWord = args.shift()?.toLowerCase();
        if (!triggerWord)
            return;
        const roleConfigs = settings?.commands?.filter((c) => c.name.toLowerCase().startsWith('role')) || [];
        let matchedConfig = null;
        for (const config of roleConfigs) {
            const aliases = Array.isArray(config.aliases) ? config.aliases :
                (typeof config.aliases === 'string' ? config.aliases.split(/, */) : []);
            const normalizedAliases = aliases.map(a => a.toLowerCase().trim());
            if (normalizedAliases.includes(triggerWord) || config.name.toLowerCase() === triggerWord) {
                if (config.enabled === false)
                    return;
                matchedConfig = config;
                break;
            }
        }
        if (!matchedConfig && triggerWord !== 'role')
            return;
        if (args.length < 2) {
            return message.reply(`Usage: \`${prefix}role <user> <role1>, <role2>, ...\``);
        }
        const memberTarget = args.shift();
        const rolesString = args.join(' ');
        const member = message.mentions.members?.first() ||
            await message?.guild?.members.fetch(memberTarget.replace(/[<@!>]/g, '')).catch(() => null);
        if (!member)
            return message.reply('Invalid user');
        const rawRoles = rolesString.split(',').map(r => r.trim()).filter(r => r.length > 0);
        const botMember = message.guild?.members.me;
        if (!botMember)
            return;
        const results = [];
        for (const roleInput of rawRoles) {
            let role = message.guild?.roles.cache.get(roleInput.replace(/[<@&>]/g, ''));
            if (!role) {
                role = message.guild?.roles.cache.find(r => r.name.toLowerCase() === roleInput.toLowerCase());
            }
            if (!role) {
                results.push(`**${roleInput}**: Role not found`);
                continue;
            }
            const isRemoving = member.roles.cache.has(role.id);
            const actionToCheck = isRemoving ? 'role remove' : 'role give';
            if (!this.checkPermissions(message, settings, actionToCheck, true)) {
                results.push(`**${role.name}**: Permission denied for ${actionToCheck}`);
                continue;
            }
            if (role.position >= botMember.roles.highest.position) {
                results.push(`**${role.name}**: Cannot manage (hierarchy issues)`);
                continue;
            }
            if (message.guild?.ownerId !== message.author.id && role.position >= message.member.roles.highest.position) {
                results.push(`**${role.name}**: Cannot manage (role is higher or equal to yours)`);
                continue;
            }
            try {
                if (isRemoving) {
                    await member.roles.remove(role);
                    results.push(`**${role.name}**: Removed`);
                }
                else {
                    await member.roles.add(role);
                    results.push(`**${role.name}**: Added`);
                }
            }
            catch {
                results.push(`**${role.name}**: Unexpected error`);
            }
        }
        if (results.length > 0) {
            return message.reply(results.join('\n'));
        }
    }
    checkPermissions(message, settings, commandName, silent = false) {
        const config = settings.commands?.find((c) => c.name === commandName);
        const isAdmin = message.member?.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator);
        if (!config)
            return !!isAdmin;
        if (config.enabled === false)
            return false;
        const parentId = message.channel && 'parentId' in message.channel ? message.channel.parentId : null;
        if (!message.channel || !parentId)
            return false;
        if (config.deniedChannels?.some(id => id === message.channelId || id === parentId))
            return false;
        if (config.allowedChannels?.length > 0) {
            const isAllowed = config.allowedChannels.some(id => id === message.channelId || id === parentId);
            if (!isAllowed)
                return false;
        }
        const memberRoles = message.member?.roles.cache;
        if (memberRoles && config.deniedRoles?.some((id) => memberRoles.has(id)))
            return false;
        const hasAllowedRole = memberRoles && config.allowedRoles?.some((id) => memberRoles.has(id));
        if (hasAllowedRole || isAdmin)
            return true;
        if (!silent)
            message.reply(`You do not have permission to use **${commandName}**`);
        return false;
    }
};
exports.RolePrefixHandler = RolePrefixHandler;
__decorate([
    (0, necord_1.On)('messageCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RolePrefixHandler.prototype, "onMessageCreate", null);
exports.RolePrefixHandler = RolePrefixHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], RolePrefixHandler);
//# sourceMappingURL=role-prefix.commands.js.map