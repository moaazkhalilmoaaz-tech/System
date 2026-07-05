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
exports.UnlockCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const unlock_dto_1 = require("./../dto/unlock.dto");
let UnlockCommand = class UnlockCommand {
    client;
    constructor(client) {
        this.client = client;
    }
    async onUnlockSlash([interaction], { channel }) {
        if (!interaction.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels))
            return interaction.reply({
                content: 'I do not have permission to manage channels.',
                flags: 64,
            });
        const target = channel ??
            interaction.channel;
        if (!target ||
            !(target instanceof discord_js_1.TextChannel || target instanceof discord_js_1.NewsChannel))
            return interaction.reply({
                content: 'This command can only be used in text channels.',
                flags: 64,
            });
        try {
            await target.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: true,
            });
            await interaction.reply({
                content: `**${target.name}** has been unlocked.`,
                flags: 64,
            });
        }
        catch {
            await interaction.reply({
                content: 'Could not unlock the channel.',
                flags: 64,
            });
        }
    }
    async onUnlockPrefix([message], args) {
        if (!message.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels))
            return message.reply('I do not have permission to manage channels.');
        const target = message.mentions.channels.first() ||
            this.client.channels.cache.get(args[0]) ||
            message.channel;
        if (!(target instanceof discord_js_1.TextChannel || target instanceof discord_js_1.NewsChannel))
            return message.reply('This command can only be used in text channels.');
        try {
            await target.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: true,
            });
            await message.reply(`**${target.name}** has been unlocked.`);
        }
        catch {
            message.reply('Could not unlock the channel.');
        }
    }
};
exports.UnlockCommand = UnlockCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'unlock',
        description: 'Unlock a channel',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, unlock_dto_1.UnlockDto]),
    __metadata("design:returntype", Promise)
], UnlockCommand.prototype, "onUnlockSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], UnlockCommand.prototype, "onUnlockPrefix", null);
exports.UnlockCommand = UnlockCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client])
], UnlockCommand);
;
//# sourceMappingURL=unlock.commands.js.map