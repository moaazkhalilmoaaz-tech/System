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
exports.LeaderboardCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pagination_1 = require("@necord/pagination");
const credit_entity_1 = require("../../database/entities/credit.entity");
const settings_service_1 = require("./../../api/settings/settings.service");
let LeaderboardCommand = class LeaderboardCommand {
    creditRepository;
    paginationService;
    settingService;
    constructor(creditRepository, paginationService, settingService) {
        this.creditRepository = creditRepository;
        this.paginationService = paginationService;
        this.settingService = settingService;
    }
    async onSlash([interaction]) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        if (settings.allowedChannels && !settings.allowedChannels.includes(interaction.channelId)) {
            return interaction.reply({
                content: "لا يمكن استخدام هذا الامر في هذا الروم",
                flags: 64,
            });
        }
        return this.handleLeaderboard(interaction, interaction.user.id, settings.embedColor);
    }
    async onText([message]) {
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        if (settings.allowedChannels && !settings.allowedChannels.includes(message.channel.id)) {
            return message.reply("لا يمكن استخدام هذا الامر في هذا الروم");
        }
        return this.handleLeaderboard(message, message.author.id, settings.embedColor);
    }
    async handleLeaderboard(context, userId, color) {
        const users = await this.creditRepository.find({
            where: { credit: (0, typeorm_2.MoreThan)(0) },
            order: { credit: 'DESC' },
            take: 100
        });
        if (users.length === 0) {
            const content = `لا يمكن ايجاد اي اعضاء`;
            return context instanceof discord_js_1.ChatInputCommandInteraction
                ? context.reply({ content, flags: 64 })
                : context.reply(content);
        }
        const USERS_PER_PAGE = 10;
        const maxPages = Math.ceil(users.length / USERS_PER_PAGE);
        const pagination = this.paginationService.create((builder) => builder
            .setCustomId(`lb-${userId}-${Date.now()}`)
            .setMaxPages(maxPages)
            .setFilter((i) => i.user.id === userId)
            .setPagesFactory((pageNumber) => {
            const startIndex = (pageNumber - 1) * USERS_PER_PAGE;
            const endIndex = startIndex + USERS_PER_PAGE;
            const currentUsers = users.slice(startIndex, endIndex);
            let content = '';
            currentUsers.forEach((user, index) => {
                const rank = startIndex + index + 1;
                content += `**#${rank} - <@${user.userId}> \`${user.credit.toLocaleString('en-us')} Royal\`**\n`;
            });
            return new pagination_1.PageBuilder().setEmbeds([
                new discord_js_1.EmbedBuilder()
                    .setTitle(`Top Users of bank 🏦 (Page ${pageNumber}/${maxPages})`)
                    .setColor('#7c5bbe')
                    .setDescription(content)
                    .setFooter({ text: `Requested by ${context instanceof discord_js_1.Message ? context.author.tag : context.user.tag}` })
            ]);
        }));
        const pageOptions = await pagination.build();
        return context instanceof discord_js_1.ChatInputCommandInteraction
            ? context.reply(pageOptions)
            : context.reply(pageOptions);
    }
};
exports.LeaderboardCommand = LeaderboardCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'leaderboard',
        description: 'View top users',
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LeaderboardCommand.prototype, "onSlash", null);
__decorate([
    (0, necord_1.TextCommand)({
        name: 'leaderboard',
        description: 'View top users',
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LeaderboardCommand.prototype, "onText", null);
exports.LeaderboardCommand = LeaderboardCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_entity_1.Credit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pagination_1.NecordPaginationService,
        settings_service_1.SettingsService])
], LeaderboardCommand);
//# sourceMappingURL=leaderboard.commands.js.map