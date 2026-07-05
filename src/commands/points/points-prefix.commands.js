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
exports.PointsPrefixHandler = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const settings_service_1 = require("./../../api/settings/settings.service");
const pagination_1 = require("@necord/pagination");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const point_entity_1 = require("../../database/entities/point.entity");
let PointsPrefixHandler = class PointsPrefixHandler {
    pointRepository;
    paginationService;
    settingService;
    constructor(pointRepository, paginationService, settingService) {
        this.pointRepository = pointRepository;
        this.paginationService = paginationService;
        this.settingService = settingService;
    }
    async onMessageCreate([message]) {
        if (message.author.bot || !message.content || !message.guildId)
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
        const allPointsConfigs = settings?.commands?.filter((c) => c.name.toLowerCase().startsWith('points')) || [];
        let matchedConfig = null;
        for (const config of allPointsConfigs) {
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
        if (!matchedConfig && triggerWord !== 'points')
            return;
        let intendedAction = '';
        let targetUserArg = '';
        let valueArg = '';
        if (args.length === 0) {
            intendedAction = 'points list';
        }
        else {
            const firstArg = args[0].toLowerCase();
            if (firstArg === 'reset') {
                intendedAction = 'points reset';
            }
            else if (firstArg === 'list') {
                intendedAction = 'points list';
            }
            else {
                targetUserArg = firstArg;
                intendedAction = 'points user_operation';
                if (args.length > 1)
                    valueArg = args[1];
            }
        }
        if (intendedAction === 'points list') {
            if (!this.checkPermissions(message, settings, 'points list'))
                return;
            return this.handleList(message, settings);
        }
        if (intendedAction === 'points reset') {
            if (!this.checkPermissions(message, settings, 'points reset'))
                return;
            await this.pointRepository.update({ guildId: message.guildId || '' }, { points: 0 });
            return message.reply('All points have been reset.');
        }
        const targetMember = message.mentions.members?.first() ||
            (await message.guild?.members.fetch(targetUserArg.replace(/[<@!>]/g, '')).catch(() => null));
        if (!targetMember)
            return message.reply('Invalid user.');
        if (!valueArg) {
            const doc = await this.pointRepository.findOne({
                where: { guildId: message.guildId || '', userId: targetMember.id }
            });
            return message.reply(`${targetMember.user.tag} has ${doc?.points || 0} points.`);
        }
        const value = parseInt(valueArg, 10);
        if (isNaN(value))
            return message.reply('Invalid number provided.');
        let finalAction = 'points increase';
        if (valueArg.startsWith('-'))
            finalAction = 'points decrease';
        else if (valueArg.startsWith('+'))
            finalAction = 'points increase';
        else if (value < 0)
            finalAction = 'points decrease';
        if (!this.checkPermissions(message, settings, finalAction))
            return;
        let updatedDoc = await this.pointRepository.findOne({
            where: { guildId: message.guildId || '', userId: targetMember.id }
        });
        const amountValue = Math.abs(value);
        const change = finalAction === 'points increase' ? amountValue : -amountValue;
        if (!updatedDoc) {
            updatedDoc = this.pointRepository.create({
                guildId: message.guildId || '',
                userId: targetMember.id,
                points: Math.max(0, change)
            });
        }
        else {
            updatedDoc.points = Math.max(0, updatedDoc.points + change);
        }
        await this.pointRepository.save(updatedDoc);
        return message.reply(`Done. ${targetMember.user.tag} total: ${updatedDoc?.points || 0}`);
    }
    checkPermissions(message, settings, commandName) {
        const config = settings.commands.find((c) => c.name === commandName);
        const isAdmin = message.member?.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator);
        if (!config)
            return commandName === 'points list' ? true : !!isAdmin;
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
        if (memberRoles &&
            config.deniedRoles?.some((id) => memberRoles.has(id)))
            return false;
        const hasAllowedRole = memberRoles &&
            config.allowedRoles?.some((id) => memberRoles.has(id));
        if (hasAllowedRole || isAdmin)
            return true;
        if (commandName === 'points list' &&
            (!config.allowedRoles || config.allowedRoles.length === 0))
            return true;
        message.reply('You do not have the required permission.');
        return false;
    }
    async handleList(message, settings) {
        const perPage = 10;
        const count = await this.pointRepository.count({
            where: { guildId: message.guildId || '', points: (0, typeorm_2.MoreThan)(0) }
        });
        if (!count)
            return message.reply('No users on the leaderboard yet');
        this.paginationService.register((builder) => builder
            .setCustomId(`points_pagination_${message.id}`)
            .setPagesFactory(async (pageNumber) => {
            const chunk = await this.pointRepository.find({
                where: { guildId: message.guildId || '', points: (0, typeorm_2.MoreThan)(0) },
                order: { points: 'DESC' },
                skip: (pageNumber - 1) * perPage,
                take: perPage
            });
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Points Leaderboard')
                .setColor('#7c5bbe')
                .setFooter({ text: `Page ${pageNumber}` })
                .setDescription(chunk
                .map((p, i) => `${(pageNumber - 1) * perPage + i + 1}. <@${p.userId}> - ${p.points}`)
                .join('\n'));
            return new pagination_1.PageBuilder().addEmbed(embed);
        })
            .setMaxPages(Math.ceil(count / perPage)));
        const page = await this.paginationService
            .get(`points_pagination_${message.id}`)
            .build();
        return message.reply(page);
    }
};
exports.PointsPrefixHandler = PointsPrefixHandler;
__decorate([
    (0, necord_1.On)('messageCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PointsPrefixHandler.prototype, "onMessageCreate", null);
exports.PointsPrefixHandler = PointsPrefixHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(point_entity_1.Point)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pagination_1.NecordPaginationService,
        settings_service_1.SettingsService])
], PointsPrefixHandler);
//# sourceMappingURL=points-prefix.commands.js.map