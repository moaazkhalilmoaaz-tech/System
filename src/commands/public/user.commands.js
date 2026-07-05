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
exports.UserCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const user_dto_1 = require("../dto/user.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
let UserCommand = class UserCommand {
    settingService;
    constructor(settingService) {
        this.settingService = settingService;
    }
    buildEmbed(member, color) {
        const user = member.user;
        const createdTimestamp = Math.floor(user.createdTimestamp / 1000);
        const joinedTimestamp = member.joinedTimestamp
            ? Math.floor(member.joinedTimestamp / 1000)
            : null;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: `${user.username} (${user.id})`,
            iconURL: user.displayAvatarURL()
        })
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .setColor('#7c5bbe')
            .addFields({
            name: 'Display Name',
            value: member.displayName,
            inline: false
        }, {
            name: 'Creation Date',
            value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
            inline: false
        }, {
            name: 'Joined Server',
            value: joinedTimestamp
                ? `<t:${joinedTimestamp}:F> (<t:${joinedTimestamp}:R>)`
                : 'Unknown',
            inline: false
        })
            .setTimestamp();
        return embed;
    }
    async onUserSlash([interaction], { member }) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        const target = member ?? interaction.member;
        const embed = this.buildEmbed(target, settings.embedColor);
        return interaction.reply({ embeds: [embed] });
    }
    async onUserPrefix([message], args) {
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        const target = message.mentions.members?.first() ||
            message.guild?.members.cache.get(args[0]) ||
            message.member;
        if (!target)
            return message.reply('Could not find user.');
        const embed = this.buildEmbed(target, settings.embedColor);
        return message.reply({ embeds: [embed] });
    }
};
exports.UserCommand = UserCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'user',
        description: 'Get user information',
        defaultMemberPermissions: 'SendMessages'
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserCommand.prototype, "onUserSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], UserCommand.prototype, "onUserPrefix", null);
exports.UserCommand = UserCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], UserCommand);
//# sourceMappingURL=user.commands.js.map