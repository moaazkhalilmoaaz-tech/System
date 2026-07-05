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
exports.SendCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const send_dto_1 = require("../dto/send.dto");
let SendCommand = class SendCommand {
    async onSendSlash([interaction], { member, message }) {
        if (member.user.bot) {
            return interaction.reply({
                content: 'I cannot send DMs to bots.',
                flags: 64,
            });
        }
        try {
            await member.send({
                content: `**Message from ${interaction.user.username}:**\n\n${message}`,
            });
            await interaction.reply({
                content: `Message sent to **${member.user.username}** successfully.`,
                flags: 64,
            });
        }
        catch {
            await interaction.reply({
                content: `Could not send DM to **${member.user.username}**. They might have DMs disabled.`,
                flags: 64,
            });
        }
    }
    async onSendPrefix([message], args) {
        const target = message.mentions.members?.first() ||
            message.guild?.members.cache.get(args[0]);
        const contentToSend = args.slice(1).join(' ');
        if (!target) {
            return message.reply('Please specify a valid member.');
        }
        if (!contentToSend) {
            return message.reply('Please provide a message content.');
        }
        if (target.user.bot) {
            return message.reply('I cannot send DMs to bots.');
        }
        try {
            await target.send({
                content: `**Message from ${message.author.username}:**\n\n${contentToSend}`,
            });
            await message.reply(`Message sent to **${target.user.username}**.`);
        }
        catch {
            message.reply(`Could not send DM to **${target.user.username}**. They might have DMs disabled.`);
        }
    }
};
exports.SendCommand = SendCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'send',
        description: 'Send a DM to a specific member',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, send_dto_1.SendDto]),
    __metadata("design:returntype", Promise)
], SendCommand.prototype, "onSendSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], SendCommand.prototype, "onSendPrefix", null);
exports.SendCommand = SendCommand = __decorate([
    (0, common_1.Injectable)()
], SendCommand);
//# sourceMappingURL=send.commands.js.map