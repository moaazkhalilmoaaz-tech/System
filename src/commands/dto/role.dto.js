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
exports.RoleMultiDto = exports.RoleRemoveDto = exports.RoleGiveDto = void 0;
const discord_js_1 = require("discord.js");
const necord_1 = require("necord");
class RoleGiveDto {
    user;
    role;
}
exports.RoleGiveDto = RoleGiveDto;
__decorate([
    (0, necord_1.UserOption)({
        name: 'user',
        description: 'User to add role',
        required: true,
    }),
    __metadata("design:type", discord_js_1.GuildMember)
], RoleGiveDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.RoleOption)({
        name: 'role',
        description: 'Role to give',
        required: true
    }),
    __metadata("design:type", Function)
], RoleGiveDto.prototype, "role", void 0);
;
class RoleRemoveDto {
    user;
    role;
}
exports.RoleRemoveDto = RoleRemoveDto;
__decorate([
    (0, necord_1.UserOption)({
        name: 'user',
        description: 'User to add role',
        required: true,
    }),
    __metadata("design:type", discord_js_1.GuildMember)
], RoleRemoveDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.RoleOption)({
        name: 'role',
        description: 'Role to give',
        required: true
    }),
    __metadata("design:type", Function)
], RoleRemoveDto.prototype, "role", void 0);
;
class RoleMultiDto {
    give_or_remove;
    role;
    target;
}
exports.RoleMultiDto = RoleMultiDto;
__decorate([
    (0, necord_1.StringOption)({
        name: "give_or_remove",
        description: "pick a type",
        required: true,
        choices: [
            { name: "give", value: "give" },
            { name: "remove", value: "remove" }
        ]
    }),
    __metadata("design:type", String)
], RoleMultiDto.prototype, "give_or_remove", void 0);
__decorate([
    (0, necord_1.RoleOption)({
        name: 'role',
        description: 'Role to give',
        required: true
    }),
    __metadata("design:type", Function)
], RoleMultiDto.prototype, "role", void 0);
__decorate([
    (0, necord_1.StringOption)({
        name: "target",
        description: "target to give roles to",
        choices: [
            { name: "All", value: "all" },
            { name: "Humans", value: "humans" },
            { name: "Bots", value: "bots" }
        ]
    }),
    __metadata("design:type", String)
], RoleMultiDto.prototype, "target", void 0);
;
//# sourceMappingURL=role.dto.js.map