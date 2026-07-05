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
exports.ComeCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const come_dto_1 = require("../dto/come.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const permission_utils_1 = require("./../../common/utils/permission.utils");
let ComeCommand = class ComeCommand {
    settingService;
    constructor(settingService) {
        this.settingService = settingService;
    }
    async onComeSlash([interaction], { member }) {
        return this.processCome(interaction, member);
    }
    async onComePrefix([message], args) {
        const target = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]).catch(() => null);
        if (!target)
            return message.reply('Please specify a valid member.');
        return this.processCome(message, target);
    }
    async processCome(context, member) {
        if (!context.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(context.guildId);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'come', discord_js_1.PermissionsBitField.Flags.ModerateMembers);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        if (member.user.bot) {
            return context.reply({ content: 'You cannot summon a bot.', flags: 64 });
        }
        const messageLink = context.url || (await context.fetchReply?.())?.url || '';
        return this.executeSummon(context, member, messageLink);
    }
    async executeSummon(context, member, messageLink) {
        const guild = context.guild;
        const guildName = guild?.name || 'Server';
        const guildIcon = guild?.iconURL() || undefined;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: guildName, iconURL: guildIcon })
            .setDescription(`السلام عليكم ورحمة الله وبركاته <@${member.id}>\n\n` +
            `نرجو منك التوجّه إلى رابط الرسالة الموضّح أدناه في أقرب وقت، وذلك لضرورة متابعة التذكرة أو البلاغ المرتبط بها، وتفادي أي إجراء قد يترتّب على التأخير\n\n` +
            `[يُرجى الضغط على الزر للوصول إلى الرسالة]`)
            .setColor('#7c5bbe')
            .setFooter({ text: `${guildName}`, iconURL: guildIcon })
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setLabel('الذهاب الي الرسالة')
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setURL(messageLink));
        try {
            await member.send({
                embeds: [embed],
                components: [row]
            });
            const successMsg = `Sent a summon message to **${member.user.username}**.`;
            return context.editReply
                ? context.editReply({ content: successMsg })
                : context.reply(successMsg);
        }
        catch {
            const errorMsg = `Could not DM **${member.user.username}**. They might have DMs disabled.`;
            return context.editReply
                ? context.editReply({ content: errorMsg })
                : (context.reply ? context.reply(errorMsg) : null);
        }
    }
};
exports.ComeCommand = ComeCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'come',
        description: 'Summon a member to the current channel via DM',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, come_dto_1.ComeDto]),
    __metadata("design:returntype", Promise)
], ComeCommand.prototype, "onComeSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], ComeCommand.prototype, "onComePrefix", null);
exports.ComeCommand = ComeCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], ComeCommand);
//# sourceMappingURL=come.commands.js.map