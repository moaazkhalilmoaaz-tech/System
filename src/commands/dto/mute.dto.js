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
exports.MuteVoiceDto = exports.MuteTextDto = void 0;
const discord_js_1 = require("discord.js");
const necord_1 = require("necord");
class MuteTextDto {
    user;
    time;
    reason;
}
exports.MuteTextDto = MuteTextDto;
__decorate([
    (0, necord_1.UserOption)({
        name: "user",
        description: "user to mute",
        required: true
    }),
    __metadata("design:type", discord_js_1.User)
], MuteTextDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: "time",
        description: "mute time",
        required: false
    }),
    __metadata("design:type", String)
], MuteTextDto.prototype, "time", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: "reason",
        description: "mute reason"
    }),
    __metadata("design:type", String)
], MuteTextDto.prototype, "reason", void 0);
;
class MuteVoiceDto {
    user;
    time;
    reason;
}
exports.MuteVoiceDto = MuteVoiceDto;
__decorate([
    (0, necord_1.UserOption)({
        name: "user",
        description: "user to mute",
        required: true
    }),
    __metadata("design:type", discord_js_1.User)
], MuteVoiceDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: "time",
        description: "mute time ex (10s, 1m, 6h, 3d)",
        required: false
    }),
    __metadata("design:type", String)
], MuteVoiceDto.prototype, "time", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: "reason",
        description: "mute reason"
    }),
    __metadata("design:type", String)
], MuteVoiceDto.prototype, "reason", void 0);
;
//# sourceMappingURL=mute.dto.js.map