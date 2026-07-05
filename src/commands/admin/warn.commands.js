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
exports.WarnCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const warn_dto_1 = require("./../dto/warn.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warning_entity_1 = require("../../database/entities/warning.entity");
const uuid_1 = require("uuid");
const permission_utils_1 = require("./../../common/utils/permission.utils");
const discord_js_2 = require("discord.js");
let WarnCommand = class WarnCommand {
    warnRepository;
    settingService;
    constructor(warnRepository, settingService) {
        this.warnRepository = warnRepository;
        this.settingService = settingService;
    }
    async onWarnSlash([interaction], { member, reason }) {
        return this.processWarning(interaction, member.id, reason ?? null, interaction.user.id);
    }
    async onWarnPrefix([message], args) {
        if (!message.member)
            return;
        const target = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        if (!target)
            return message.reply('Please mention a member to warn');
        const reason = args.slice(1).join(' ');
        return this.processWarning(message, target.id, reason, message.author.id);
    }
    async processWarning(context, userId, reason, moderatorId) {
        const guildId = context.guildId;
        const settings = await this.settingService.getGuildSettings(guildId);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'warn', discord_js_2.PermissionsBitField.Flags.ModerateMembers);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        const cmdConfig = settings?.commands?.find(c => c.name === 'warn');
        if (reason) {
            return this.executeWarn(context, userId, moderatorId, reason);
        }
        if (!cmdConfig || !cmdConfig.reasons || cmdConfig.reasons.length === 0) {
            return context.reply({ content: 'No reason provided and no predefined reasons found in settings', flags: 64 });
        }
        const selectMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('warn_reason_select')
            .setPlaceholder('Choose a reason for the warning')
            .addOptions(cmdConfig.reasons.map(r => ({ label: r.text, value: r.text })));
        const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
        const response = await context.reply({
            content: 'Please select a reason from the list below:',
            components: [row],
            flags: 64
        });
        const collector = response.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            time: 60000,
            filter: (i) => i.user.id === moderatorId
        });
        collector.on('collect', async (i) => {
            const selectedReason = i.values[0];
            await i.deferUpdate();
            response.delete().catch(() => null);
            await this.executeWarn(context, userId, moderatorId, selectedReason);
            collector.stop('selected');
        });
        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                await response.delete().catch(() => null);
            }
        });
    }
    async executeWarn(context, userId, moderatorId, reason) {
        const guildId = context.guildId;
        const warnId = (0, uuid_1.v4)().split('-')[0].toUpperCase();
        try {
            const warn = this.warnRepository.create({
                guildId,
                userId,
                moderatorId,
                reason,
                warnId
            });
            await this.warnRepository.save(warn);
            const user = await context.client.users.fetch(userId);
            const dmEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('You received a warning')
                .setDescription(`You have been warned in **${context.guild.name}**`)
                .addFields({ name: 'Reason', value: reason }, { name: 'Warn ID', value: warnId, inline: true })
                .setColor('#7c5bbe')
                .setTimestamp();
            await user.send({ embeds: [dmEmbed] }).catch(() => null);
            const successMsg = `**${user.tag}** has been warned for: ${reason} (ID: ${warnId})`;
            if (context.deferred || context.replied) {
                return context.editReply({ content: successMsg, components: [] });
            }
            return context.reply({ content: successMsg });
        }
        catch (error) {
            console.error(error);
            return context.reply({ content: 'An error occurred while processing the warning', flags: 64 });
        }
    }
};
exports.WarnCommand = WarnCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'warn',
        description: 'Give a warning to a member',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, warn_dto_1.WarnDto]),
    __metadata("design:returntype", Promise)
], WarnCommand.prototype, "onWarnSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], WarnCommand.prototype, "onWarnPrefix", null);
exports.WarnCommand = WarnCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warning_entity_1.Warning)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        settings_service_1.SettingsService])
], WarnCommand);
//# sourceMappingURL=warn.commands.js.map