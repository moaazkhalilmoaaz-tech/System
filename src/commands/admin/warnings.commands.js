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
exports.WarningsCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warning_entity_1 = require("../../database/entities/warning.entity");
const warnings_dto_1 = require("./../dto/warnings.dto");
const pagination_1 = require("@necord/pagination");
const settings_service_1 = require("./../../api/settings/settings.service");
let WarningsCommand = class WarningsCommand {
    warnRepository;
    paginationService;
    settingService;
    constructor(warnRepository, paginationService, settingService) {
        this.warnRepository = warnRepository;
        this.paginationService = paginationService;
        this.settingService = settingService;
    }
    async onWarningsSlash([interaction], { user }) {
        return this.processWarnings(interaction, user?.id);
    }
    async onWarningsText([message], args) {
        const targetUser = message.mentions.users.first() ||
            (args[0]?.match(/^\d{17,19}$/) ? await message.client.users.fetch(args[0]).catch(() => null) : null);
        return this.processWarnings(message, targetUser?.id);
    }
    async processWarnings(context, targetUserId) {
        const perPage = 5;
        const guildId = context.guildId;
        if (!guildId)
            return;
        const settings = await this.settingService.getGuildSettings(guildId);
        const embedColor = '#7c5bbe';
        const query = targetUserId ? { guildId, userId: targetUserId } : { guildId };
        const count = await this.warnRepository.count({ where: query });
        if (!count) {
            const noWarnsMsg = targetUserId ? `This user has no warnings.` : `The server has no warnings.`;
            return context.reply({ content: noWarnsMsg, flags: 64 });
        }
        this.paginationService.register((builder) => builder
            .setCustomId(`warnings_${context.id}`)
            .setPagesFactory(async (pageNumber) => {
            const start = (pageNumber - 1) * perPage;
            const warns = await this.warnRepository.find({
                where: query,
                order: { createdAt: 'DESC' },
                skip: start,
                take: perPage
            });
            const userObj = targetUserId ? await context.client.users.fetch(targetUserId).catch(() => null) : null;
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(userObj ? `Warnings: ${userObj.username}` : `Server Warnings Log`)
                .setColor(embedColor)
                .setFooter({ text: `Page ${pageNumber} of ${Math.ceil(count / perPage)} | Total: ${count}` })
                .setTimestamp();
            const description = warns.map((w, index) => {
                return `**#${start + index + 1} | ID: \`${w.warnId}\`**\n` +
                    `**User:** <@${w.userId}>\n` +
                    `**Moderator:** <@${w.moderatorId}>\n` +
                    `**Reason:** ${w.reason || 'No reason provided'}\n` +
                    `**Date:** <t:${Math.floor(w.createdAt.getTime() / 1000)}:R>\n` +
                    `──────────────────`;
            }).join('\n');
            embed.setDescription(description || 'No warnings found on this page.');
            return new pagination_1.PageBuilder().addEmbed(embed);
        })
            .setMaxPages(Math.ceil(count / perPage)));
        const pagination = this.paginationService.get(`warnings_${context.id}`);
        const page = await pagination.build();
        return context.reply(page);
    }
};
exports.WarningsCommand = WarningsCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'warnings',
        description: 'Show warnings for a user or the entire server',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, warnings_dto_1.WarningsDto]),
    __metadata("design:returntype", Promise)
], WarningsCommand.prototype, "onWarningsSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], WarningsCommand.prototype, "onWarningsText", null);
exports.WarningsCommand = WarningsCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warning_entity_1.Warning)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pagination_1.NecordPaginationService,
        settings_service_1.SettingsService])
], WarningsCommand);
//# sourceMappingURL=warnings.commands.js.map