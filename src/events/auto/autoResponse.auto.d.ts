import { SettingsService } from './../../api/settings/settings.service';
export declare class AutoReplyService {
    private readonly settingsService;
    private readonly logger;
    constructor(settingsService: SettingsService);
    private replaceVariables;
    onMessage([message]: [any]): Promise<void>;
}
