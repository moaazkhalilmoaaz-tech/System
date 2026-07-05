import type { SlashCommandContext, TextCommandContext } from 'necord';
import { UserDto } from '../dto/user.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class UserCommand {
    private readonly settingService;
    constructor(settingService: SettingsService);
    private buildEmbed;
    onUserSlash([interaction]: SlashCommandContext, { member }: UserDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onUserPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
