import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Repository } from 'typeorm';
import { Warning } from 'src/database/entities/warning.entity';
import { WarningsDto } from './../dto/warnings.dto';
import { NecordPaginationService } from '@necord/pagination';
import { SettingsService } from './../../api/settings/settings.service';
export declare class WarningsCommand {
    private readonly warnRepository;
    private readonly paginationService;
    private readonly settingService;
    constructor(warnRepository: Repository<Warning>, paginationService: NecordPaginationService, settingService: SettingsService);
    onWarningsSlash([interaction]: SlashCommandContext, { user }: WarningsDto): Promise<any>;
    onWarningsText([message]: TextCommandContext, args: string[]): Promise<any>;
    private processWarnings;
}
