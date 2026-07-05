import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Settings } from 'src/database/entities/settings.entity';
export declare class SettingsService {
    private settingsRepository;
    private cacheManager;
    private readonly logger;
    constructor(settingsRepository: Repository<Settings>, cacheManager: Cache);
    getGuildSettings(guildId: string): Promise<Settings | null>;
    updateGuildSettings(guildId: string, updateData: any): Promise<Settings>;
    clearGuildCache(guildId: string): Promise<void>;
}
