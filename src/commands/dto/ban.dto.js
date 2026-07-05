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
exports.BanDto = void 0;
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
class BanDto {
    user;
    reason;
    time;
}
exports.BanDto = BanDto;
__decorate([
    (0, necord_1.UserOption)({ name: 'user', description: 'The user to ban', required: true }),
    __metadata("design:type", discord_js_1.User)
], BanDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.StringOption)({ name: 'reason', description: 'Reason for the ban', required: false }),
    __metadata("design:type", String)
], BanDto.prototype, "reason", void 0);
__decorate([
    (0, necord_1.StringOption)({ name: 'time', description: 'Duration (e.g. 10d, 1h, 30m)', required: false }),
    __metadata("design:type", String)
], BanDto.prototype, "time", void 0);
//# sourceMappingURL=ban.dto.js.map