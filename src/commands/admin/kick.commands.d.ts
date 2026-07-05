import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { KickDto } from './../dto/kick.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class KickCommand {
    private readonly client;
    private readonly settingsService;
    constructor(client: Client, settingsService: SettingsService);
    onKickSlash([interaction]: SlashCommandContext, { user, reason }: KickDto): Promise<any>;
    onKickPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processKick;
}
