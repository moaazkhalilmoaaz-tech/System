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
exports.PointsResetDto = exports.PointsDecreaseDto = exports.PointsIncreaseDto = void 0;
const discord_js_1 = require("discord.js");
const necord_1 = require("necord");
class PointsIncreaseDto {
    user;
    points;
}
exports.PointsIncreaseDto = PointsIncreaseDto;
__decorate([
    (0, necord_1.UserOption)({
        name: 'user',
        description: 'User to add points to',
        required: true,
    }),
    __metadata("design:type", discord_js_1.User)
], PointsIncreaseDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.NumberOption)({
        name: 'points',
        description: 'points to increase',
        required: true
    }),
    __metadata("design:type", Number)
], PointsIncreaseDto.prototype, "points", void 0);
;
class PointsDecreaseDto {
    user;
    points;
}
exports.PointsDecreaseDto = PointsDecreaseDto;
__decorate([
    (0, necord_1.UserOption)({
        name: 'user',
        description: 'User to decrease points',
        required: true,
    }),
    __metadata("design:type", discord_js_1.User)
], PointsDecreaseDto.prototype, "user", void 0);
__decorate([
    (0, necord_1.NumberOption)({
        name: 'points',
        description: 'points to decrease',
        required: true
    }),
    __metadata("design:type", Number)
], PointsDecreaseDto.prototype, "points", void 0);
;
class PointsResetDto {
    user;
}
exports.PointsResetDto = PointsResetDto;
__decorate([
    (0, necord_1.UserOption)({
        name: 'user',
        description: 'User to decrease points',
        required: false,
    }),
    __metadata("design:type", discord_js_1.User)
], PointsResetDto.prototype, "user", void 0);
;
//# sourceMappingURL=points.dto.js.map