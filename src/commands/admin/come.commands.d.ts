import type { SlashCommandContext, TextCommandContext } from 'necord';
import { ComeDto } from '../dto/come.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class ComeCommand {
    private readonly settingService;
    constructor(settingService: SettingsService);
    onComeSlash([interaction]: SlashCommandContext, { member }: ComeDto): Promise<any>;
    onComePrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processCome;
    private executeSummon;
}
