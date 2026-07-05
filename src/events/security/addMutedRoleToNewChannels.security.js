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
var AddMutedRoleToNewChannelService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMutedRoleToNewChannelService = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
let AddMutedRoleToNewChannelService = AddMutedRoleToNewChannelService_1 = class AddMutedRoleToNewChannelService {
    logger = new common_1.Logger(AddMutedRoleToNewChannelService_1.name);
    async onChannelCreate([channel]) {
        if (channel.isDMBased())
            return;
        try {
            const guild = channel.guild;
            const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
            if (!muteRole)
                return;
            if (!channel.manageable) {
                this.logger.warn(`Cannot set mute perms for new channel ${channel.name}: Missing Permissions`);
                return;
            }
            await channel.permissionOverwrites.create(muteRole, {
                SendMessages: false,
                AddReactions: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false,
                Speak: false,
                Stream: false,
                UseApplicationCommands: false
            });
            this.logger.log(`Updated Muted permissions for new channel: ${channel.name}`);
        }
        catch (error) {
            this.logger.error(`Error setting mute perms for new channel: ${error.message}`);
        }
    }
};
exports.AddMutedRoleToNewChannelService = AddMutedRoleToNewChannelService;
__decorate([
    (0, necord_1.On)('channelCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddMutedRoleToNewChannelService.prototype, "onChannelCreate", null);
exports.AddMutedRoleToNewChannelService = AddMutedRoleToNewChannelService = AddMutedRoleToNewChannelService_1 = __decorate([
    (0, common_1.Injectable)()
], AddMutedRoleToNewChannelService);
//# sourceMappingURL=addMutedRoleToNewChannels.security.js.map