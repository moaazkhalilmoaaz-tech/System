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
exports.MoveCommand = void 0;
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const move_decorator_1 = require("./../../common/decorators/move.decorator");
const move_dto_1 = require("../dto/move.dto");
let MoveCommand = class MoveCommand {
    async move([interaction], { user, channel }) {
        await interaction.deferReply({ flags: 64 });
        const member = await interaction.guild?.members.fetch({
            user: user.id,
            force: true,
        });
        if (!member) {
            return interaction.editReply({
                content: 'Member not found',
            });
        }
        if (!member.voice.channel) {
            return interaction.editReply({
                content: 'User is not in a voice channel',
            });
        }
        if (!channel || channel.type != discord_js_1.ChannelType.GuildVoice) {
            return interaction.editReply({
                content: 'Target channel must be a voice channel',
            });
        }
        try {
            await member.voice.setChannel(channel);
            return interaction.editReply({
                content: `**${member.user.tag}** moved to **${channel.name}**`,
            });
        }
        catch {
            return interaction.editReply({
                content: 'Failed to move member',
            });
        }
    }
    async movePrefix([message], args) {
        const guild = message.guild;
        if (!guild)
            return;
        if (args.length < 2) {
            return message.reply('Usage: `!move @user <voice channel>`');
        }
        const userArg = args[0];
        const channelArg = args.slice(1).join(' ');
        const targetMember = guild.members.cache.get(userArg.replace(/\D/g, '')) ||
            guild.members.cache.find((m) => m.user.username.toLowerCase() === userArg.toLowerCase());
        if (!targetMember) {
            return message.reply('Member not found');
        }
        if (!targetMember.voice.channel) {
            return message.reply('User is not in a voice channel');
        }
        const targetChannel = guild.channels.cache.find((c) => c.type === discord_js_1.ChannelType.GuildVoice &&
            (c.name.toLowerCase() === channelArg.toLowerCase() ||
                c.id === channelArg));
        if (!targetChannel || targetChannel.type !== discord_js_1.ChannelType.GuildVoice) {
            return message.reply('Target channel not found or not a voice channel');
        }
        try {
            await targetMember.voice.setChannel(targetChannel);
            return message.reply(`**${targetMember.user.tag}** moved to **${targetChannel.name}**`);
        }
        catch {
            return message.reply('Failed to move member. Check my permissions');
        }
    }
};
exports.MoveCommand = MoveCommand;
__decorate([
    (0, necord_1.Subcommand)({
        name: 'user',
        description: 'move user from voice channel',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, move_dto_1.MoveDto]),
    __metadata("design:returntype", Promise)
], MoveCommand.prototype, "move", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], MoveCommand.prototype, "movePrefix", null);
exports.MoveCommand = MoveCommand = __decorate([
    (0, move_decorator_1.MoveCommandDecorator)()
], MoveCommand);
;
//# sourceMappingURL=move.commands.js.map