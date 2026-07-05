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
exports.PointsCommand = void 0;
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const points_decorator_1 = require("./../../common/decorators/points.decorator");
const points_dto_1 = require("../dto/points.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const point_entity_1 = require("../../database/entities/point.entity");
const pagination_1 = require("@necord/pagination");
const settings_service_1 = require("./../../api/settings/settings.service");
const common_1 = require("@nestjs/common");
let PointsCommand = class PointsCommand {
    pointRepository;
    paginationService;
    settingService;
    constructor(pointRepository, paginationService, settingService) {
        this.pointRepository = pointRepository;
        this.paginationService = paginationService;
        this.settingService = settingService;
    }
    async pointsIncrease([interaction], { user, points }) {
        let doc = await this.pointRepository.findOne({ where: { userId: user.id, guildId: interaction.guildId ?? '' } });
        if (!doc) {
            doc = this.pointRepository.create({ guildId: interaction.guildId || '', userId: user.id, points: 0 });
        }
        doc.points += points;
        await this.pointRepository.save(doc);
        return interaction.reply({
            content: `**${user.tag}** points increased by **${points}**. Total: **${doc.points}**`,
        });
    }
    async pointsDecrease([interaction], { user, points }) {
        const doc = await this.pointRepository.findOne({ where: { guildId: interaction.guildId || '', userId: user.id } });
        if (!doc) {
            return interaction.reply({
                content: `**${user.tag}** has no points`,
                flags: 64,
            });
        }
        doc.points = Math.max(doc.points - points, 0);
        await this.pointRepository.save(doc);
        return interaction.reply({
            content: `**${user.tag}** points decreased by **${points}**. Total: **${doc.points}**`,
        });
    }
    async pointsReset([interaction], { user }) {
        if (user) {
            let doc = await this.pointRepository.findOne({ where: { guildId: interaction.guildId || '', userId: user.id } });
            if (!doc) {
                doc = this.pointRepository.create({ guildId: interaction.guildId || '', userId: user.id, points: 0 });
            }
            else {
                doc.points = 0;
                await this.pointRepository.save(doc);
            }
            return interaction.reply({
                content: `**${user.tag}** points reset to **0**`,
            });
        }
        else {
            await this.pointRepository.update({ guildId: interaction.guildId || '' }, { points: 0 });
            return interaction.reply({
                content: "All users' points have been reset to **0**",
            });
        }
    }
    async pointsList([interaction]) {
        const perPage = 10;
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        const count = await this.pointRepository.count({ where: { guildId: interaction.guildId, points: (0, typeorm_2.MoreThan)(0) } });
        if (!count) {
            return interaction.reply({ content: "No users on this page", flags: 64 });
        }
        this.paginationService.register((builder) => builder
            .setCustomId('points_pagination')
            .setPagesFactory(async (pageNumber) => {
            const allUsers = await this.pointRepository.find({
                where: { guildId: interaction.guildId || '', points: (0, typeorm_2.MoreThan)(0) },
                order: { points: 'DESC' }
            });
            const start = (pageNumber - 1) * perPage;
            const chunk = allUsers.slice(start, start + perPage);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Points Leaderboard')
                .setColor('#7c5bbe')
                .setFooter({ text: `Page ${pageNumber}` })
                .setDescription(chunk
                .map((p, index) => `${start + index + 1}. <@${p.userId}> - ${p.points} points`)
                .join('\n') || 'No users on this page');
            return new pagination_1.PageBuilder().addEmbed(embed);
        })
            .setMaxPages(Math.ceil(count / perPage)));
        const pagination = this.paginationService.get('points_pagination');
        const page = await pagination.build();
        return interaction.reply(page);
    }
};
exports.PointsCommand = PointsCommand;
__decorate([
    (0, necord_1.Subcommand)({
        name: 'increase',
        description: 'increase user points',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, points_dto_1.PointsIncreaseDto]),
    __metadata("design:returntype", Promise)
], PointsCommand.prototype, "pointsIncrease", null);
__decorate([
    (0, necord_1.Subcommand)({
        name: 'decrease',
        description: 'decrease user points',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, points_dto_1.PointsDecreaseDto]),
    __metadata("design:returntype", Promise)
], PointsCommand.prototype, "pointsDecrease", null);
__decorate([
    (0, necord_1.Subcommand)({
        name: 'reset',
        description: 'reset user points',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, points_dto_1.PointsResetDto]),
    __metadata("design:returntype", Promise)
], PointsCommand.prototype, "pointsReset", null);
__decorate([
    (0, necord_1.Subcommand)({
        name: 'list',
        description: 'list points',
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PointsCommand.prototype, "pointsList", null);
exports.PointsCommand = PointsCommand = __decorate([
    (0, points_decorator_1.PointsCommandDecorator)(),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(point_entity_1.Point)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pagination_1.NecordPaginationService,
        settings_service_1.SettingsService])
], PointsCommand);
;
//# sourceMappingURL=points.commands.js.map