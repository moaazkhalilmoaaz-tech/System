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
exports.RoleReward = void 0;
const typeorm_1 = require("typeorm");
let RoleReward = class RoleReward {
    id;
    guildId;
    roleId;
    requiredLevel;
    type;
    removePrevious;
    createdAt;
    updatedAt;
};
exports.RoleReward = RoleReward;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoleReward.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], RoleReward.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoleReward.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], RoleReward.prototype, "requiredLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'text' }),
    __metadata("design:type", String)
], RoleReward.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RoleReward.prototype, "removePrevious", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoleReward.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RoleReward.prototype, "updatedAt", void 0);
exports.RoleReward = RoleReward = __decorate([
    (0, typeorm_1.Entity)('role_rewards'),
    (0, typeorm_1.Unique)(['guildId', 'roleId', 'requiredLevel', 'type'])
], RoleReward);
//# sourceMappingURL=role-reward.entity.js.map