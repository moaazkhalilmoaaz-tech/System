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
exports.PingCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const settings_service_1 = require("./../../api/settings/settings.service");
let PingCommand = class PingCommand {
    client;
    settingService;
    constructor(client, settingService) {
        this.client = client;
        this.settingService = settingService;
    }
    async onPingSlash([interaction]) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        const start = Date.now();
        await interaction.reply({ content: 'Pinging...', withResponse: true });
        const latency = Date.now() - start;
        const wsLatency = Math.round(this.client.ws.ping);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('Pong 🏓')
            .setColor('#7c5bbe')
            .addFields({ name: 'Message Latency', value: `${latency}ms`, inline: true }, { name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true })
            .setTimestamp();
        return interaction.editReply({ content: null, embeds: [embed] });
    }
    async onPingPrefix([message]) {
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        const start = Date.now();
        const msg = await message.reply('Pinging...');
        const latency = Date.now() - start;
        const wsLatency = Math.round(this.client.ws.ping);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('Pong 🏓')
            .setColor('#7c5bbe')
            .addFields({ name: 'Message Latency', value: `${latency}ms`, inline: true }, { name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true })
            .setTimestamp();
        return msg.edit({ content: ``, embeds: [embed] });
    }
};
exports.PingCommand = PingCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'ping',
        description: 'Check bot ping',
        dmPermission: false,
        defaultMemberPermissions: 'SendMessages'
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PingCommand.prototype, "onPingSlash", null);
__decorate([
    (0, necord_1.TextCommand)({
        name: 'ping',
        description: 'Check bot ping'
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PingCommand.prototype, "onPingPrefix", null);
exports.PingCommand = PingCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client,
        settings_service_1.SettingsService])
], PingCommand);
;
//# sourceMappingURL=ping.commands.js.map