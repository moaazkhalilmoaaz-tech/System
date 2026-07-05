import type { TextCommandContext, SlashCommandContext } from 'necord';
import { Client } from 'discord.js';
import { SettingsService } from './../../api/settings/settings.service';
export declare class PingCommand {
    private readonly client;
    private readonly settingService;
    constructor(client: Client, settingService: SettingsService);
    onPingSlash([interaction]: SlashCommandContext): Promise<import("discord.js").Message<boolean> | undefined>;
    onPingPrefix([message]: TextCommandContext): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
