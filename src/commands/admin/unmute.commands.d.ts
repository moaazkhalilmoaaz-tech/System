import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Repository } from 'typeorm';
import { UnmuteDto } from '../dto/unmute.dto';
import { Mute } from '../../database/entities/mute.entity';
import { SettingsService } from '../../api/settings/settings.service';
export declare class UnmuteCommands {
    private muteRepository;
    private readonly settingsService;
    constructor(muteRepository: Repository<Mute>, settingsService: SettingsService);
    unmuteTextSlash([interaction]: SlashCommandContext, { member, reason }: UnmuteDto): Promise<any>;
    unmuteVoiceSlash([interaction]: SlashCommandContext, { member, reason }: UnmuteDto): Promise<any>;
    unmuteTextPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    unmuteVoicePrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processUnmute;
}
