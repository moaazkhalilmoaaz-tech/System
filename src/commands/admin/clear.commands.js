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
exports.ClearCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const clear_dto_1 = require("../dto/clear.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const permission_utils_1 = require("./../../common/utils/permission.utils");
let ClearCommand = class ClearCommand {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async onClearSlash([interaction], { amount }) {
        return this.processClear(interaction, amount ?? 0);
    }
    async onClearPrefix([message], args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount))
            return message.reply('Please provide a valid number.');
        return this.processClear(message, amount);
    }
    async processClear(context, amount) {
        if (!context.guildId)
            return;
        const settings = await this.settingsService.getGuildSettings(context.guildId);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'clear', discord_js_1.PermissionsBitField.Flags.ManageMessages);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        if (!context.guild?.members.me?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageMessages)) {
            const msg = 'I do not have permission to manage messages.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        if (!amount || amount < 1 || amount > 100) {
            const msg = 'Please provide a number between 1 and 100.';
            return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
        }
        try {
            const channel = context.channel;
            if (!channel || !channel.isTextBased() || channel.isDMBased()) {
                const msg = 'This command can only be used in text channels.';
                return context.reply ? context.reply({ content: msg, flags: 64 }) : context.send(msg);
            }
            const messages = await channel.messages.fetch({ limit: amount });
            await channel.bulkDelete(messages, true);
            const response = `Successfully deleted ${messages.size} messages.`;
            if (context.isChatInputCommand?.()) {
                return context.reply({ content: response, flags: 64 });
            }
            else {
                const m = await context.reply(response);
                setTimeout(() => {
                    m.delete?.().catch(() => { });
                }, 2000);
            }
        }
        catch {
            const errorMsg = 'Could not delete messages.';
            return context.reply ? context.reply({ content: errorMsg, flags: 64 }) : context.send(errorMsg);
        }
    }
};
exports.ClearCommand = ClearCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'clear',
        description: 'Clear a number of messages in the channel',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, clear_dto_1.ClearDto]),
    __metadata("design:returntype", Promise)
], ClearCommand.prototype, "onClearSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], ClearCommand.prototype, "onClearPrefix", null);
exports.ClearCommand = ClearCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], ClearCommand);
//# sourceMappingURL=clear.commands.js.map