import type { SlashCommandContext, TextCommandContext } from 'necord';
import { WarnDto } from './../dto/warn.dto';
import { SettingsService } from './../../api/settings/settings.service';
import { Repository } from 'typeorm';
import { Warning } from 'src/database/entities/warning.entity';
export declare class WarnCommand {
    private readonly warnRepository;
    private readonly settingService;
    constructor(warnRepository: Repository<Warning>, settingService: SettingsService);
    onWarnSlash([interaction]: SlashCommandContext, { member, reason }: WarnDto): Promise<any>;
    onWarnPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processWarning;
    private executeWarn;
}
