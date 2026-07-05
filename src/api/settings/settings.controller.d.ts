import type { Response } from 'express';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    viewSettingsPage(id: string): {
        title: string;
        guildId: string;
    };
    getSettingsData(guildId: string): Promise<import("../../database/entities/settings.entity").Settings | null>;
    saveSettings(guildId: string, settingsDto: SettingsDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
