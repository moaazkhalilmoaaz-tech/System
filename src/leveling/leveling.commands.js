"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelingCommands = void 0;
const common_1 = require("@nestjs/common");
const Necord = __importStar(require("necord"));
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const leveling_service_1 = require("./leveling.service");
const settings_service_1 = require("../api/settings/settings.service");
const user_dto_1 = require("../commands/dto/user.dto");
const setLevel_dto_1 = require("../commands/dto/setLevel.dto");
let LevelingCommands = class LevelingCommands {
    levelingService;
    settingsService;
    constructor(levelingService, settingsService) {
        this.levelingService = levelingService;
        this.settingsService = settingsService;
    }
    async onProfile([interaction], options) {
        if (!interaction.guildId)
            return;
        const targetUser = options.member?.user || interaction.user;
        const dbUser = await this.levelingService.getOrCreateUser(interaction.guildId, targetUser.id);
        const rank = await this.levelingService.getUserRank(interaction.guildId, targetUser.id);
        await interaction.deferReply();
        try {
            const member = await interaction.guild?.members.fetch({ user: targetUser.id, withPresences: true, force: true }).catch(() => null);
            console.log(`[LevelingCommands] Fetched member ${targetUser.tag}. Presence:`, member?.presence?.status);
            const status = member?.presence?.status || 'offline';
            const statusMessage = member?.presence?.activities[0]?.state || '';
            const cardBuffer = await this.levelingService.createRankCard(targetUser, dbUser.textLevel, dbUser.textXp, dbUser.royal, dbUser.reputation, rank, status, statusMessage);
            const attachment = new discord_js_1.AttachmentBuilder(cardBuffer, { name: 'rank-card.png' });
            await interaction.editReply({ files: [attachment] });
        }
        catch (error) {
            console.error('Profile card error:', error);
            await interaction.editReply({ content: "Error generating profile card." });
        }
    }
    async onRank([interaction], options) {
        if (!interaction.guildId)
            return;
        const targetUser = options.member?.user || interaction.user;
        const dbUser = await this.levelingService.getOrCreateUser(interaction.guildId, targetUser.id);
        const textRank = await this.levelingService.getUserRank(interaction.guildId, targetUser.id);
        await interaction.deferReply();
        try {
            const member = await interaction.guild?.members.fetch({ user: targetUser.id, withPresences: true, force: true }).catch(() => null);
            const status = member?.presence?.status || 'offline';
            const voiceRank = await this.levelingService.getUserVoiceRank(interaction.guildId, targetUser.id);
            const cardBuffer = await this.levelingService.createRankImage(targetUser, dbUser.textLevel, dbUser.textXp, textRank, dbUser.voiceLevel, dbUser.voiceXp, voiceRank, status);
            const attachment = new discord_js_1.AttachmentBuilder(cardBuffer, { name: 'rank-card.png' });
            await interaction.editReply({ files: [attachment] });
        }
        catch (error) {
            console.error('Rank card error:', error);
            await interaction.editReply({ content: "Error generating rank card." });
        }
    }
    async onTop([interaction]) {
        if (!interaction.guildId)
            return;
        const initialCategory = 'text';
        const initialTimeframe = 'all';
        const { embed, rows } = await this.levelingService.generateTopData(interaction.guildId, initialCategory, initialTimeframe);
        const response = await interaction.reply({
            embeds: [embed],
            components: rows,
            withResponse: true
        });
        const collector = response.resource?.message?.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000
        });
        collector?.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "هذا القائمة ليست لك.", flags: 64 });
            }
            const parts = i.customId.split(':');
            if (parts[0] !== 'top')
                return;
            const category = parts[1];
            const timeframe = parts[2];
            const { embed: newEmbed, rows: newRows } = await this.levelingService.generateTopData(interaction.guildId, category, timeframe);
            await i.update({
                embeds: [newEmbed],
                components: newRows,
                files: []
            });
        });
    }
    async onTextTop([message]) {
        return this.handleTextTop(message);
    }
    async onTextT([message]) {
        return this.handleTextTop(message);
    }
    async handleTextTop(message) {
        if (!message.guildId)
            return;
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
                components: newRows,
                files: []
            });
        });
    }
    async onSetLevel([interaction], options) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingsService.getGuildSettings(interaction.guildId);
        if (settings?.owners && !settings.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: "This command is only for server owners.", flags: 64 });
        }
        const targetUser = options.member.user;
        const dbUser = await this.levelingService.getOrCreateUser(interaction.guildId, targetUser.id);
        dbUser.textLevel = options.level;
        dbUser.textXp = 0;
        await this.levelingService.levelingRepository.save(dbUser);
        return interaction.reply({ content: `✅ Set <@${targetUser.id}> level to **${options.level}**.` });
    }
};
exports.LevelingCommands = LevelingCommands;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'profile',
        description: 'Check your or another user profile card',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], LevelingCommands.prototype, "onProfile", null);
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'rank',
        description: 'See your current rank and XP',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], LevelingCommands.prototype, "onRank", null);
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'top',
        description: 'Show server leaderboard',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LevelingCommands.prototype, "onTop", null);
__decorate([
    Necord.TextCommand({
        name: 'top',
        description: 'Show server leaderboard',
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LevelingCommands.prototype, "onTextTop", null);
__decorate([
    Necord.TextCommand({
        name: 't',
        description: 'Show server leaderboard',
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LevelingCommands.prototype, "onTextT", null);
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'set-level',
        description: 'Set a user level (Owner Only)',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, setLevel_dto_1.SetLevelDto]),
    __metadata("design:returntype", Promise)
], LevelingCommands.prototype, "onSetLevel", null);
exports.LevelingCommands = LevelingCommands = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leveling_service_1.LevelingService,
        settings_service_1.SettingsService])
], LevelingCommands);
//# sourceMappingURL=leveling.commands.js.map