import * as Necord from 'necord';
import { LevelingService } from './leveling.service';
import { SettingsService } from '../api/settings/settings.service';
import { UserDto } from '../commands/dto/user.dto';
import { SetLevelDto } from '../commands/dto/setLevel.dto';
export declare class LevelingCommands {
    private readonly levelingService;
    private readonly settingsService;
    constructor(levelingService: LevelingService, settingsService: SettingsService);
    onProfile([interaction]: Necord.SlashCommandContext, options: UserDto): Promise<void>;
    onRank([interaction]: Necord.SlashCommandContext, options: UserDto): Promise<void>;
    onTop([interaction]: Necord.SlashCommandContext): Promise<void>;
    onTextTop([message]: [any]): Promise<void>;
    onTextT([message]: [any]): Promise<void>;
    private handleTextTop;
    onSetLevel([interaction]: Necord.SlashCommandContext, options: SetLevelDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
