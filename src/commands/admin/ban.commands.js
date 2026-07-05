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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ban_entity_1 = require("../../database/entities/ban.entity");
const settings_service_1 = require("../../api/settings/settings.service");
const ban_dto_1 = require("../dto/ban.dto");
const ms_1 = __importDefault(require("ms"));
const permission_utils_1 = require("../../common/utils/permission.utils");
let BanCommand = class BanCommand {
    client;
    banRepository;
    settingsService;
    constructor(client, banRepository, settingsService) {
        this.client = client;
        this.banRepository = banRepository;
        this.settingsService = settingsService;
    }
    async onBanSlash([interaction], options) {
        if (!interaction.guildId)
            return;
        await interaction.deferReply({ ephemeral: true });
        const timeObj = options.time
            ? this.parseTimeString(options.time)
            : undefined;
        return this.processBan(interaction, options.user.id, options.reason ?? null, interaction.user.id, timeObj ?? undefined);
    }
    async onBanPrefix([message], args) {
        if (!message.guildId)
            return;
        const target = message.mentions.users.first() ||
            (await this.client.users.fetch(args[0]).catch(() => null));
        if (!target)
            return message.reply('User not found.');
        let timeObj = undefined;
        let reason = args.slice(1).join(' ');
        if (args[1] && /^\d+[smhdwy]$/.test(args[1])) {
            const parsed = this.parseTimeString(args[1]);
            if (parsed) {
                timeObj = parsed;
                reason = args.slice(2).join(' ');
            }
        }
        const targetId = typeof target === 'string' ? target : target.id;
        return this.processBan(message, targetId, reason, message.author.id, timeObj);
    }
    parseTimeString(timeStr) {
        const match = timeStr.match(/^(\d+)([smhdwy])$/);
        if (!match)
            return null;
        return { amount: parseInt(match[1]), unit: match[2] };
    }
    async processBan(context, targetId, manualReason, moderatorId, manualTime) {
        const guild = context.guild;
        if (!guild)
            return;
        const moderator = await guild.members.fetch(moderatorId).catch(() => null);
        const targetMember = await guild.members.fetch(targetId).catch(() => null);
        const botMember = guild.members.me;
        if (targetMember) {
            if (moderator &&
                targetMember.roles.highest.position >=
                    moderator.roles.highest.position &&
                moderatorId !== guild.ownerId) {
                return context.reply({
                    content: 'You cannot ban a user with a higher or equal role to yours.',
                    flags: 64,
                });
            }
            if (botMember &&
                targetMember.roles.highest.position >= botMember.roles.highest.position) {
                return context.reply({
                    content: 'I cannot ban this user because their role is higher than mine.',
                    flags: 64,
                });
            }
        }
        else {
            const userExists = await this.client.users.fetch(targetId).catch(() => null);
            if (!userExists) {
                return context.reply({
                    content: 'Invalid User ID. User not found on Discord.',
                    flags: 64,
                });
            }
        }
        const settings = await this.settingsService.getGuildSettings(guild.id);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'ban', discord_js_1.PermissionsBitField.Flags.BanMembers);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        const cmdConfig = settings?.commands?.find((c) => c.name === 'ban');
        let finalTime = manualTime;
        if (!manualReason && !manualTime && cmdConfig) {
            if (cmdConfig.defaultAction === 'time') {
                finalTime = {
                    amount: cmdConfig.specificTime,
                    unit: cmdConfig.specificUnit,
                };
            }
            else if (cmdConfig.defaultAction === 'list_reason') {
                if (cmdConfig.reasons && cmdConfig.reasons.length > 0) {
                    return this.showReasonMenu(context, targetId, moderatorId, cmdConfig.reasons, settings);
                }
            }
        }
        return this.executeBan(context, targetId, moderatorId, manualReason || 'No reason provided', settings, finalTime);
    }
    async showReasonMenu(context, targetId, moderatorId, reasons, settings) {
        const menu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(`ban_select_${context.id}`)
            .setPlaceholder('Select a ban reason')
            .addOptions(reasons.map((r) => ({
            label: r.text,
            value: JSON.stringify({ r: r.text, a: r.time, u: r.unit }),
            description: r.time ? `Duration: ${r.time}${r.unit}` : 'Permanent',
        })));
        const row = new discord_js_1.ActionRowBuilder().addComponents(menu);
        const response = await context.reply({
            content: 'Select a reason from the menu:',
            components: [row],
            flags: 64,
        });
        const collector = response.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            time: 60000,
            filter: (i) => i.user.id === moderatorId,
        });
        collector.on('collect', async (i) => {
            const data = JSON.parse(i.values[0]);
            await response.delete();
            await this.executeBan(context, targetId, moderatorId, data.r, settings, data.a ? { amount: data.a, unit: data.u } : undefined);
            collector.stop();
        });
    }
    async executeBan(context, targetId, moderatorId, reason, settings, punishTime) {
        try {
            const guild = context.guild;
            let expireDate = new Date(8640000000000000);
            if (punishTime?.amount) {
                const msTime = (0, ms_1.default)(`${punishTime.amount}${punishTime.unit}`);
                expireDate = new Date(Date.now() + msTime);
            }
            await guild.members.ban(targetId, {
                reason: `Moderator: <@${moderatorId}> | Reason: ${reason}`,
            });
            const ban = this.banRepository.create({
                guildId: guild.id,
                member: targetId,
                by: moderatorId,
                reason: reason,
                time: expireDate,
                punishTime: punishTime || { unit: 'permanent', amount: 0 },
            });
            await this.banRepository.save(ban);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('User Banned')
                .setColor('#7c5bbe')
                .setDescription(`**User:** <@${targetId}>\n**Reason:** ${reason}\n**Duration:** ${punishTime ? `${punishTime.amount}${punishTime.unit}` : 'Permanent'}`)
                .setTimestamp();
            return context.editReply
                ? await context.editReply({ embeds: [embed], content: '' })
                : await context.reply({ embeds: [embed] });
        }
        catch (e) {
            console.error(e);
            return context.reply({
                content: 'An error occurred while executing the ban.',
                flags: 64,
            });
        }
    }
};
exports.BanCommand = BanCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'ban',
        description: 'Ban a user from the server',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, ban_dto_1.BanDto]),
    __metadata("design:returntype", Promise)
], BanCommand.prototype, "onBanSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], BanCommand.prototype, "onBanPrefix", null);
exports.BanCommand = BanCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(ban_entity_1.Ban)),
    __metadata("design:paramtypes", [discord_js_1.Client,
        typeorm_2.Repository,
        settings_service_1.SettingsService])
], BanCommand);
//# sourceMappingURL=ban.commands.js.map