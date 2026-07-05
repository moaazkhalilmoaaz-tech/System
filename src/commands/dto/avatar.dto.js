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
exports.AvatarDto = void 0;
const discord_js_1 = require("discord.js");
const necord_1 = require("necord");
class AvatarDto {
    user;
    type;
}
exports.AvatarDto = AvatarDto;
__decorate([
    (0, necord_1.UserOption)({
        name: 'user',
        description: 'User to display avatar',
        required: false,
    }),
    __metadata("design:type", discord_js_1.User)
], AvatarDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: 'type',
        description: 'Avatar type',
        required: false,
        choices: [
            { name: 'Avatar', value: 'avatar' },
            { name: 'Banner', value: 'banner' },
            { name: 'Server Avatar', value: 'server' },
        ],
    }),
    __metadata("design:type", String)
], AvatarDto.prototype, "type", void 0);
;
//# sourceMappingURL=avatar.dto.js.map