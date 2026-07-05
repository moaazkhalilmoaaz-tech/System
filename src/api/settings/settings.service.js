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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settings_entity_1 = require("../../database/entities/settings.entity");
let SettingsService = SettingsService_1 = class SettingsService {
    settingsRepository;
    cacheManager;
    logger = new common_1.Logger(SettingsService_1.name);
    constructor(settingsRepository, cacheManager) {
        this.settingsRepository = settingsRepository;
        this.cacheManager = cacheManager;
    }
    async getGuildSettings(guildId) {
        const cacheKey = `guild_settings_${guildId}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        const settings = await this.settingsRepository.findOne({ where: { guildId } });
        await this.cacheManager.set(cacheKey, settings);
        return settings;
    }
    async updateGuildSettings(guildId, updateData) {
        const cacheKey = `guild_settings_${guildId}`;
        let settings;
        const existing = await this.settingsRepository.findOne({ where: { guildId } });
        if (existing) {
            Object.assign(existing, updateData);
            settings = existing;
        }
        else {
            settings = this.settingsRepository.create();
            Object.assign(settings, updateData);
            settings.guildId = guildId;
        }
        const saved = await this.settingsRepository.save(settings);
        await this.cacheManager.set(cacheKey, saved);
        return saved;
    }
    async clearGuildCache(guildId) {
        await this.cacheManager.del(`guild_settings_${guildId}`);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settings_entity_1.Settings)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], SettingsService);
//# sourceMappingURL=settings.service.js.map