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
exports.AvatarCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const avatar_dto_1 = require("../dto/avatar.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
let AvatarCommand = class AvatarCommand {
    client;
    settingService;
    constructor(client, settingService) {
        this.client = client;
        this.settingService = settingService;
    }
    async onAvatarSlash([interaction], options) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        const user = options.user ?? interaction.user;
        const type = options.type ?? 'avatar';
        let imageUrl;
        if (type === 'banner') {
            const fetchedUser = await this.client.users.fetch(user.id, {
                force: true,
            });
            imageUrl = fetchedUser.bannerURL({ size: 1024 });
        }
        else if (type === 'server' && interaction.guild) {
            imageUrl = interaction.guild.iconURL({ size: 1024 });
        }
        else {
            imageUrl = user.displayAvatarURL({ size: 1024 });
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#7c5bbe')
            .setTitle(`${user.username}'s ${type}`)
            .setImage(imageUrl)
            .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
    }
    async onAvatarPrefix([message], args) {
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        const type = (args.find((a) => ['avatar', 'banner', 'server'].includes(a)) ?? 'avatar');
        const user = message.mentions.users.first() ??
            (args[0] && /^\d{17,20}$/.test(args[0])
                ? await this.client.users.fetch(args[0]).catch(() => message.author)
                : message.author);
        const imageUrl = type === 'server'
            ? message.guild?.iconURL({ size: 1024 })
            : type === 'banner'
                ? (await this.client.users.fetch(user.id, { force: true })).bannerURL({ size: 1024 })
                : user.displayAvatarURL({ size: 1024 });
        if (!imageUrl)
            return void message.reply('Image not available.');
        await message.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#7c5bbe')
                    .setTitle(type === 'server'
                    ? `${message.guild.name}'s Avatar`
                    : `${user.username}'s ${type}`)
                    .setImage(imageUrl)
                    .setFooter({
                    text: `Requested by ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL(),
                }),
            ],
        });
    }
};
exports.AvatarCommand = AvatarCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'avatar',
        description: 'Display user avatar / banner / server avatar',
        defaultMemberPermissions: 'SendMessages'
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, avatar_dto_1.AvatarDto]),
    __metadata("design:returntype", Promise)
], AvatarCommand.prototype, "onAvatarSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], AvatarCommand.prototype, "onAvatarPrefix", null);
exports.AvatarCommand = AvatarCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client,
        settings_service_1.SettingsService])
], AvatarCommand);
;
//# sourceMappingURL=avatar.commands.js.map