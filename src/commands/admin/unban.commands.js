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
exports.UnbanCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const unban_dto_1 = require("../dto/unban.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ban_entity_1 = require("../../database/entities/ban.entity");
let UnbanCommand = class UnbanCommand {
    client;
    settingService;
    banRepository;
    constructor(client, settingService, banRepository) {
        this.client = client;
        this.settingService = settingService;
        this.banRepository = banRepository;
    }
    async onUnbanSlash([interaction], { user, reason }) {
        if (!interaction.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: 'I do not have permission to unban members.',
                flags: 64,
            });
        }
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        try {
            const ban = await interaction.guild?.bans.fetch(user.id).catch(() => null);
            if (!ban) {
                return await interaction.reply({
                    content: 'This user is not banned.',
                    flags: 64,
                });
            }
            await interaction.guild?.bans.remove(user.id, reason || 'No reason provided');
            await this.banRepository.delete({ guildId: interaction.guildId || '', member: user.id });
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('#7c5bbe')
                .setTitle('User Unbanned')
                .setDescription(`**${user.tag}** has been unbanned.\nReason: ${reason || 'No reason provided'}`);
            await interaction.reply({ embeds: [embed] });
        }
        catch (e) {
            console.log(e);
            await interaction.reply({
                content: 'An error occurred while executing the unban.',
                flags: 64,
            });
        }
    }
    async onUnbanPrefix([message], args) {
        if (!message.member?.permissions.has(discord_js_1.PermissionsBitField.Flags.BanMembers))
            return;
        if (!message.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.BanMembers)) {
            return message.reply('I do not have permission to unban members.');
        }
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        const userIdOrMention = args[0];
        if (!userIdOrMention)
            return message.reply('Please provide a user ID or mention.');
        const user = message.mentions.users.first() ?? await this.client.users.fetch(userIdOrMention).catch(() => null);
        if (!user)
            return message.reply('User not found.');
        try {
            const ban = await message.guild.bans.fetch(user.id).catch(() => null);
            if (!ban)
                return message.reply('This user is not banned.');
            const reason = args.slice(1).join(' ') || 'No reason provided';
            await message.guild.bans.remove(user.id, reason);
            await this.banRepository.delete({ guildId: message.guildId || '', member: user.id });
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('#7c5bbe')
                .setTitle('User Unbanned')
                .setDescription(`**${user.tag}** has been unbanned.\nReason: ${reason}`);
            await message.reply({ embeds: [embed] });
        }
        catch {
            message.reply('Could not unban this user.');
        }
    }
};
exports.UnbanCommand = UnbanCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'unban',
        description: 'Unban a user from the server',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, unban_dto_1.UnBanDto]),
    __metadata("design:returntype", Promise)
], UnbanCommand.prototype, "onUnbanSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], UnbanCommand.prototype, "onUnbanPrefix", null);
exports.UnbanCommand = UnbanCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(ban_entity_1.Ban)),
    __metadata("design:paramtypes", [discord_js_1.Client,
        settings_service_1.SettingsService,
        typeorm_2.Repository])
], UnbanCommand);
//# sourceMappingURL=unban.commands.js.map