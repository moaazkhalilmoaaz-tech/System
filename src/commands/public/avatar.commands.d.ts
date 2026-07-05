import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { AvatarDto } from '../dto/avatar.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class AvatarCommand {
    private readonly client;
    private readonly settingService;
    constructor(client: Client, settingService: SettingsService);
    onAvatarSlash([interaction]: SlashCommandContext, options: AvatarDto): Promise<void>;
    onAvatarPrefix([message]: TextCommandContext, args: string[]): Promise<undefined>;
}
