import type { SlashCommandContext, TextCommandContext } from 'necord';
import { ClearDto } from '../dto/clear.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class ClearCommand {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    onClearSlash([interaction]: SlashCommandContext, { amount }: ClearDto): Promise<any>;
    onClearPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processClear;
}
