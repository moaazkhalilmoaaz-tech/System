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
exports.SayCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const say_dto_1 = require("../dto/say.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
const permission_utils_1 = require("./../../common/utils/permission.utils");
let SayCommand = class SayCommand {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async onSaySlash([interaction], { message }) {
        return this.processSay(interaction, message);
    }
    async onSayPrefix([message], args) {
        const content = args.join(' ');
        if (!content)
            return message.reply('Please provide a message to say.');
        return this.processSay(message, content);
    }
    async processSay(context, content) {
        if (!context.guildId)
            return;
        const settings = await this.settingsService.getGuildSettings(context.guildId);
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(context, settings, 'say', discord_js_1.PermissionsBitField.Flags.Administrator);
        if (!permCheck.allowed) {
            return context.reply({ content: permCheck.message || 'Permission denied.', flags: 64 });
        }
        try {
            if (context.deletable) {
                await context.delete().catch(() => null);
            }
        }
        catch {
        }
        const channel = context.channel;
        if (context.reply && !context.isChatInputCommand?.()) {
            await channel.send(content);
        }
        else if (context.reply) {
            await context.reply({ content: 'Message sent!', flags: 64 });
            await channel.send(content);
        }
        else {
            await channel.send(content);
        }
    }
};
exports.SayCommand = SayCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'say',
        description: 'Make the bot say something',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, say_dto_1.SayDto]),
    __metadata("design:returntype", Promise)
], SayCommand.prototype, "onSaySlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], SayCommand.prototype, "onSayPrefix", null);
exports.SayCommand = SayCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SayCommand);
//# sourceMappingURL=say.commands.js.map