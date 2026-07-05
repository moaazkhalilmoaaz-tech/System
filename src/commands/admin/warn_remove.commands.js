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
exports.WarnRemoveCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const warn_remove_dto_1 = require("./../dto/warn_remove.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warning_entity_1 = require("../../database/entities/warning.entity");
let WarnRemoveCommand = class WarnRemoveCommand {
    warnRepository;
    constructor(warnRepository) {
        this.warnRepository = warnRepository;
    }
    async onWarnRemoveSlash([interaction], { input }) {
        return this.processWarnRemoval(interaction, input);
    }
    async onWarnRemovePrefix([message], args) {
        const input = args[0];
        if (!input)
            return message.reply('Please provide [Warn id], [user mention/ID], or [all]');
        return this.processWarnRemoval(message, input);
    }
    async processWarnRemoval(context, input) {
        const guildId = context.guildId;
        const cleanInput = input.trim().replace('<@', '').replace('>', '');
        if (cleanInput.toLowerCase() === 'all') {
            const result = await this.warnRepository.delete({ guildId });
            return context.reply({ content: `Successfully removed all **${result.affected ?? 0}** warnings from this server` });
        }
        const userIdMatch = cleanInput.match(/\d+/);
        const userId = userIdMatch ? userIdMatch[0] : null;
        if (userId) {
            const result = await this.warnRepository.delete({ guildId, userId });
            if ((result.affected ?? 0) > 0) {
                return context.reply({ content: `Successfully removed all **${result.affected}** warnings from <@${userId}>` });
            }
        }
        const warnResult = await this.warnRepository.delete({ guildId, warnId: cleanInput.toUpperCase() });
        if ((warnResult.affected ?? 0) > 0) {
            return context.reply({ content: `Successfully removed warning with ID: \`${cleanInput.toUpperCase()}\`` });
        }
        return context.reply({ content: `No warnings found for the provided input: \`${cleanInput}\``, flags: 64 });
    }
};
exports.WarnRemoveCommand = WarnRemoveCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'warn_remove',
        description: 'Remove warnings from a user or by ID',
        dmPermission: false,
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, warn_remove_dto_1.WarnRemoveDto]),
    __metadata("design:returntype", Promise)
], WarnRemoveCommand.prototype, "onWarnRemoveSlash", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], WarnRemoveCommand.prototype, "onWarnRemovePrefix", null);
exports.WarnRemoveCommand = WarnRemoveCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warning_entity_1.Warning)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WarnRemoveCommand);
//# sourceMappingURL=warn_remove.commands.js.map