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
var AutoReplyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoReplyService = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const settings_service_1 = require("./../../api/settings/settings.service");
const discord_js_1 = require("discord.js");
let AutoReplyService = AutoReplyService_1 = class AutoReplyService {
    settingsService;
    logger = new common_1.Logger(AutoReplyService_1.name);
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    replaceVariables(text, message) {
        if (!text)
            return text;
        return text
            .replace(/\[user\]/g, message.author.toString())
            .replace(/\[userName\]/g, message.author.username);
    }
    async onMessage([message]) {
        if (message.author.bot || !message.guildId)
            return;
        try {
            const settings = await this.settingsService.getGuildSettings(message.guildId);
            if (!settings?.autoReply?.enabled || !settings.autoReply.replies)
                return;
            const userMessage = message.content.trim().toLowerCase();
            const member = message.member;
            for (const reply of settings.autoReply.replies) {
                let isMatch = false;
                const trigger = reply.trigger.toLowerCase();
                if (reply.wildcard) {
                    if (userMessage.includes(trigger))
                        isMatch = true;
                }
                else {
                    if (userMessage === trigger)
                        isMatch = true;
                }
                if (!isMatch)
                    continue;
                if (reply.disabledChannels?.includes(message.channelId))
                    continue;
                if (reply.allowedChannels?.length > 0 && !reply.allowedChannels.includes(message.channelId)) {
                    continue;
                }
                if (member) {
                    if (reply.disabledRoles?.length > 0) {
                        const hasDisabledRole = member.roles.cache.some(r => reply.disabledRoles.includes(r.id));
                        if (hasDisabledRole)
                            continue;
                    }
                    if (reply.allowedRoles?.length > 0) {
                        const hasEnabledRole = member.roles.cache.some(r => reply.allowedRoles.includes(r.id));
                        if (!hasEnabledRole)
                            continue;
                    }
                }
                const responseText = this.replaceVariables(reply.response, message);
                const embeds = [];
                if (reply.isEmbed && reply.embed) {
                    const embed = new discord_js_1.EmbedBuilder();
                    if (reply.response)
                        embed.setDescription(responseText);
                    if (reply.embed.title)
                        embed.setTitle(this.replaceVariables(reply.embed.title, message));
                    if (reply.embed.color) {
                        embed.setColor(reply.embed.color);
                    }
                    else {
                        embed.setColor('#7c5bbe');
                    }
                    if (reply.embed.image)
                        embed.setImage(reply.embed.image);
                    embeds.push(embed);
                }
                const payload = {
                    content: (!reply.isEmbed && responseText) ? responseText : undefined,
                    embeds: embeds.length > 0 ? embeds : undefined
                };
                if (payload.content || payload.embeds) {
                    if (reply.replyToUser) {
                        await message.reply(payload);
                    }
                    else {
                        await message.channel.send(payload);
                    }
                    break;
                }
            }
        }
        catch (error) {
            this.logger.error(`Error in AutoReply: ${error.message}`);
        }
    }
};
exports.AutoReplyService = AutoReplyService;
__decorate([
    (0, necord_1.On)('messageCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutoReplyService.prototype, "onMessage", null);
exports.AutoReplyService = AutoReplyService = AutoReplyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], AutoReplyService);
//# sourceMappingURL=autoResponse.auto.js.map