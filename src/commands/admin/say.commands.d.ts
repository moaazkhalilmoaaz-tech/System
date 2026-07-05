import type { TextCommandContext, SlashCommandContext } from 'necord';
import { SayDto } from '../dto/say.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class SayCommand {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    onSaySlash([interaction]: SlashCommandContext, { message }: SayDto): Promise<any>;
    onSayPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processSay;
}
