import { Message } from 'discord.js';
import { SettingsService } from './../../api/settings/settings.service';
export declare class RolePrefixHandler {
    private readonly settingService;
    constructor(settingService: SettingsService);
    onMessageCreate([message]: [Message]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | undefined>;
    private checkPermissions;
}
