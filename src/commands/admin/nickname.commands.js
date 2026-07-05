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
exports.NicknameCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const nickname_dto_1 = require("../dto/nickname.dto");
let NicknameCommand = class NicknameCommand {
    async onNicknameSlash([interaction], { member, nickname }) {
        if (!interaction.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({
                content: 'I do not have permission to manage nicknames.',
                flags: 64,
            });
        }
        if (!member.manageable) {
            return interaction.reply({
                content: 'I cannot change this user\'s nickname due to role hierarchy.',
                flags: 64,
            });
        }
        try {
            const newNick = nickname || null;
            await member.setNickname(newNick);
            const messageContent = newNick
                ? `Changed **${member.user.username}**'s nickname to **${newNick}**.`
                : `Reset **${member.user.username}**'s nickname to default.`;
            await interaction.reply({
                content: messageContent,
            });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while changing the nickname.',
                flags: 64,
            });
        }
    }
    async onNicknamePrefix([message], args) {
        if (!message.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageNicknames)) {
            return message.reply('I do not have permission to manage nicknames.');
        }
        const target = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
        const rawNickname = args.slice(1).join(' ');
        const newNickname = rawNickname.length > 0 ? rawNickname : null;
        if (!target) {
            return message.reply('Please specify a valid member.');
        }
        if (!target.manageable) {
            return message.reply('I cannot change this user\'s nickname due to role hierarchy.');
        }
        try {
            await target.setNickname(newNickname);
            const messageContent = newNickname
                ? `Changed **${target.user.username}**'s nickname to **${newNickname}**.`
                : `Reset **${target.user.username}**'s nickname to default.`;
            await message.reply(messageContent);
        }
        catch (error) {
            console.error(error);
            message.reply('An error occurred while changing the nickname.');
        }
    }
};
exports.NicknameCommand = NicknameCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'nickname',
        description: 'Change a member nickname',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, nickname_dto_1.NicknameDto]),
    __metadata("design:returntype", Promise)
], NicknameCommand.prototype, "onNicknameSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], NicknameCommand.prototype, "onNicknamePrefix", null);
exports.NicknameCommand = NicknameCommand = __decorate([
    (0, common_1.Injectable)()
], NicknameCommand);
//# sourceMappingURL=nickname.commands.js.map