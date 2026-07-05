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
var AutoLineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoLineService = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const settings_service_1 = require("./../../api/settings/settings.service");
let AutoLineService = AutoLineService_1 = class AutoLineService {
    settingsService;
    logger = new common_1.Logger(AutoLineService_1.name);
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async onMessage([message]) {
        if (message.author.bot)
            return;
        if (!message.guildId)
            return;
        try {
            const settings = await this.settingsService.getGuildSettings(message.guildId);
            if (!settings || !settings.autoLine || !settings.autoLine.enabled) {
                return;
            }
            const currentChannelId = message.channelId;
            const allowedChannels = settings.autoLine.channels;
            if (allowedChannels.includes(currentChannelId)) {
                const lineUrl = settings.autoLine.imageUrl;
                if (!lineUrl)
                    return;
                if (!lineUrl.match(/^https?:\/\//)) {
                    this.logger.warn(`Potential LFI attempt in guild ${message.guildId}: ${lineUrl}`);
                    return;
                }
                await message.channel.send({
                    files: [lineUrl],
                });
            }
        }
        catch (error) {
            this.logger.error(`Error in AutoLine: ${error.message}`);
        }
    }
};
exports.AutoLineService = AutoLineService;
__decorate([
    (0, necord_1.On)('messageCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutoLineService.prototype, "onMessage", null);
exports.AutoLineService = AutoLineService = AutoLineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], AutoLineService);
//# sourceMappingURL=autoLine.auto.js.map