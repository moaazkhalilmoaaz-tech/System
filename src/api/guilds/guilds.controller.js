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
exports.GuildsController = void 0;
const common_1 = require("@nestjs/common");
const guilds_service_1 = require("./guilds.service");
const auth_guard_1 = require("../auth/auth.guard");
let GuildsController = class GuildsController {
    guildsService;
    constructor(guildsService) {
        this.guildsService = guildsService;
    }
    getAllGuilds() {
        return this.guildsService.getBotGuilds();
    }
};
exports.GuildsController = GuildsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuildsController.prototype, "getAllGuilds", null);
exports.GuildsController = GuildsController = __decorate([
    (0, common_1.Controller)('api/guilds'),
    __metadata("design:paramtypes", [guilds_service_1.GuildsService])
], GuildsController);
//# sourceMappingURL=guilds.controller.js.map