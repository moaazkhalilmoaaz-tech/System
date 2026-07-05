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
exports.ShowCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const show_dto_1 = require("./../dto/show.dto");
let ShowCommand = class ShowCommand {
    client;
    constructor(client) {
        this.client = client;
    }
    async onShowSlash([interaction], { channel }) {
        if (!interaction.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels))
            return interaction.reply({
                content: 'I do not have permission to manage channels.',
                flags: 64,
            });
        const target = channel ??
            interaction.channel;
        if (!target || !('permissionOverwrites' in target)) {
            return interaction.reply({
                content: 'Invalid channel or cannot manage permissions for this channel.',
                flags: 64,
            });
        }
        try {
            await target.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                ViewChannel: true,
            });
            await interaction.reply({
                content: `**${target.name}** is now visible.`,
            });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Could not show the channel.',
                flags: 64,
            });
        }
    }
    async onShowPrefix([message], args) {
        if (!message.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels))
            return message.reply('I do not have permission to manage channels.');
        const target = message.mentions.channels.first() ||
            message.guild?.channels.cache.get(args[0]) ||
            message.channel;
        if (!target || !('permissionOverwrites' in target)) {
            return message.reply('Invalid channel or cannot manage permissions here.');
        }
        try {
            const channelToShow = target;
            await channelToShow.permissionOverwrites.edit(message.guild.roles.everyone, {
                ViewChannel: true,
            });
            await message.reply(`**${channelToShow.name}** is now visible.`);
        }
        catch (error) {
            console.error(error);
            message.reply('Could not show the channel.');
        }
    }
};
exports.ShowCommand = ShowCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'show',
        description: 'Reveal a hidden channel',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, show_dto_1.ShowDto]),
    __metadata("design:returntype", Promise)
], ShowCommand.prototype, "onShowSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], ShowCommand.prototype, "onShowPrefix", null);
exports.ShowCommand = ShowCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client])
], ShowCommand);
//# sourceMappingURL=show.commands.js.map