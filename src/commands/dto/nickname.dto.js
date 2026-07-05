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
exports.NicknameDto = void 0;
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
class NicknameDto {
    member;
    nickname;
}
exports.NicknameDto = NicknameDto;
__decorate([
    (0, necord_1.MemberOption)({
        name: 'member',
        description: 'The member to change nickname',
        required: true,
    }),
    __metadata("design:type", discord_js_1.GuildMember)
], NicknameDto.prototype, "member", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: 'nickname',
        description: 'The new nickname (max 32 chars)',
        required: false
    }),
    __metadata("design:type", String)
], NicknameDto.prototype, "nickname", void 0);
//# sourceMappingURL=nickname.dto.js.map