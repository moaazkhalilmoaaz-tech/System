import type { SlashCommandContext, TextCommandContext } from 'necord';
import { UntimeoutDto } from './../dto/untimeout.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class UntimeoutCommand {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    onUntimeoutSlash([interaction]: SlashCommandContext, { member, reason }: UntimeoutDto): Promise<any>;
    onUntimeoutPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processUntimeout;
}
