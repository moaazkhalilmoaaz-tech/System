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
exports.LevelingListener = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const leveling_service_1 = require("./leveling.service");
const settings_service_1 = require("../api/settings/settings.service");
let LevelingListener = class LevelingListener {
    levelingService;
    settingsService;
    voiceSessions = new Map();
    constructor(levelingService, settingsService) {
        this.levelingService = levelingService;
        this.settingsService = settingsService;
    }
    async onMessageCreate([message]) {
        if (message.author.bot || !message.guildId)
            return;
        const settings = await this.settingsService.getGuildSettings(message.guildId);
        const prefix = settings?.prefix || '!';
        const parts = message.content.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        const isProfileCmd = ['p', `${prefix}p`, 'profile', `${prefix}profile`].includes(cmd);
        const isRankCmd = ['r', `${prefix}r`, 'rank', `${prefix}rank`].includes(cmd);
        if (isProfileCmd || isRankCmd) {
            let targetUser = message.author;
            const targetIdentifier = args[0];
            if (targetIdentifier) {
                const mentionMatch = targetIdentifier.match(/^<@!?(\d+)>$/);
                if (mentionMatch) {
                    try {
                        targetUser = await message.client.users.fetch(mentionMatch[1]);
                    }
                    catch { }
                }
                else if (/^\d{17,19}$/.test(targetIdentifier)) {
                    try {
                        targetUser = await message.client.users.fetch(targetIdentifier);
                    }
                    catch { }
                }
            }
            if (targetUser.bot)
                return message.reply("لا يمكن عرض بيانات البوتات.");
            const dbUser = await this.levelingService.getOrCreateUser(message.guildId, targetUser.id);
            const member = await message.guild?.members.fetch({ user: targetUser.id, withPresences: true, force: true }).catch(() => null);
            const status = member?.presence?.status || 'offline';
            if (isProfileCmd) {
                const rank = await this.levelingService.getUserRank(message.guildId, targetUser.id);
                const statusMessage = member?.presence?.activities[0]?.state || '';
                const royals = await this.levelingService.getUserBalance(targetUser.id);
                try {
                    const cardBuffer = await this.levelingService.createRankCard(targetUser, dbUser.textLevel, dbUser.textXp, royals, dbUser.reputation, rank, status, statusMessage);
                    const attachment = new discord_js_1.AttachmentBuilder(cardBuffer, { name: 'profile-card.png' });
                    return message.reply({ files: [attachment] });
                }
                catch (error) {
                    console.error('Profile error:', error);
                }
            }
            else if (isRankCmd) {
                const textRank = await this.levelingService.getUserRank(message.guildId, targetUser.id);
                const voiceRank = await this.levelingService.getUserVoiceRank(message.guildId, targetUser.id);
                try {
                    const cardBuffer = await this.levelingService.createRankImage(targetUser, dbUser.textLevel, dbUser.textXp, textRank, dbUser.voiceLevel, dbUser.voiceXp, voiceRank, status);
                    const attachment = new discord_js_1.AttachmentBuilder(cardBuffer, { name: 'rank-card.png' });
                    return message.reply({ files: [attachment] });
                }
                catch (error) {
                    console.error('Rank error:', error);
                }
            }
        }
        else if (cmd === 't' || cmd === `${prefix}t` || cmd === 'top' || cmd === `${prefix}top`) {
            const initialCategory = 'text';
            const initialTimeframe = 'all';
            const { embed, rows } = await this.levelingService.generateTopData(message.guildId, initialCategory, initialTimeframe);
            const response = await message.reply({
                embeds: [embed],
                components: rows
            });
            const collector = response.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.Button,
                time: 60000
            });
            collector.on('collect', async (i) => {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: "هذا القائمة ليست لك.", flags: 64 });
                }
                const parts = i.customId.split(':');
                if (parts[0] !== 'top')
                    return;
                const category = parts[1];
                const timeframe = parts[2];
                const { embed: newEmbed, rows: newRows } = await this.levelingService.generateTopData(message.guildId, category, timeframe);
                await i.update({
                    embeds: [newEmbed],
                    components: newRows
                });
            });
            return;
        }
        const xpToAdd = Math.floor(Math.random() * 11) + 15;
        const { leveledUp, newLevel, buffer } = await this.levelingService.addXp(message.guildId, message.author.id, xpToAdd, 'text', message.author);
        if (leveledUp && buffer) {
            const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: `level-up-${newLevel}.png` });
            const content = `مبروك! وصلت ليفل **${newLevel}** 🎉 <@${message.author.id}>`;
            const channelId = settings?.leveling?.channelId;
            const targetChannel = channelId ? await message.guild?.channels.fetch(channelId).catch(() => null) : null;
            if (targetChannel && targetChannel.isTextBased()) {
                await targetChannel.send({
                    content,
                    files: [attachment]
                });
            }
            else {
                await message.reply({
                    content,
                    files: [attachment]
                });
            }
        }
    }
    async onVoiceStateUpdate([oldState, newState]) {
        const userId = newState.member?.id;
        const guildId = newState.guild.id;
        if (!userId || newState.member?.user.bot)
            return;
        if (!oldState.channelId && newState.channelId) {
            this.voiceSessions.set(`${guildId}:${userId}`, Date.now());
        }
        else if (oldState.channelId && !newState.channelId) {
            const joinTime = this.voiceSessions.get(`${guildId}:${userId}`);
            if (joinTime) {
                const minutes = Math.floor((Date.now() - joinTime) / 60000);
                if (minutes > 0) {
                    const xpToAdd = minutes * 20;
                    const { leveledUp, newLevel, buffer } = await this.levelingService.addXp(guildId, userId, xpToAdd, 'voice', newState.member.user);
                    if (leveledUp && buffer) {
                        const settings = await this.settingsService.getGuildSettings(guildId);
                        const channelId = settings?.leveling?.channelId;
                        if (channelId) {
                            const targetChannel = await newState.guild.channels.fetch(channelId).catch(() => null);
                            if (targetChannel && targetChannel.isTextBased()) {
                                const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: `level-up-${newLevel}.png` });
                                await targetChannel.send({
                                    content: `مبروك! وصلت ليفل **${newLevel}** 🎉 <@${userId}> (من الـ Voice)`,
                                    files: [attachment]
                                });
                            }
                        }
                    }
                }
                this.voiceSessions.delete(`${guildId}:${userId}`);
            }
        }
    }
};
exports.LevelingListener = LevelingListener;
__decorate([
    (0, necord_1.On)('messageCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LevelingListener.prototype, "onMessageCreate", null);
__decorate([
    (0, necord_1.On)('voiceStateUpdate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LevelingListener.prototype, "onVoiceStateUpdate", null);
exports.LevelingListener = LevelingListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leveling_service_1.LevelingService,
        settings_service_1.SettingsService])
], LevelingListener);
//# sourceMappingURL=leveling.listener.js.map