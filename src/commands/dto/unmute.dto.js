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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmuteDto = void 0;
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
class UnmuteDto {
    member;
    reason;
}
exports.UnmuteDto = UnmuteDto;
__decorate([
    (0, necord_1.MemberOption)({
        name: 'user',
        description: 'The member to unmute',
        required: true,
    }),
    __metadata("design:type", discord_js_1.GuildMember)
], UnmuteDto.prototype, "member", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: 'reason',
        description: 'Reason for unmuting',
        required: false,
    }),
    __metadata("design:type", String)
], UnmuteDto.prototype, "reason", void 0);
//# sourceMappingURL=unmute.dto.js.map