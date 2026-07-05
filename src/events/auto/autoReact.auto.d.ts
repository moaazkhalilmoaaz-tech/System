import { SettingsService } from './../../api/settings/settings.service';
export declare class AutoReactService {
    private readonly settingsService;
    private readonly logger;
    constructor(settingsService: SettingsService);
    onMessage([message]: [any]): Promise<void>;
}
