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
exports.GuildsService = void 0;
const common_1 = require("@nestjs/common");
const discord_js_1 = require("discord.js");
let GuildsService = class GuildsService {
    client;
    constructor(client) {
        this.client = client;
    }
    getBotGuilds() {
        const guilds = this.client.guilds.cache.map((guild) => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
                : null,
            memberCount: guild.memberCount,
        }));
        return guilds.sort((a, b) => b.memberCount - a.memberCount);
    }
};
exports.GuildsService = GuildsService;
exports.GuildsService = GuildsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client])
], GuildsService);
//# sourceMappingURL=guilds.service.js.map