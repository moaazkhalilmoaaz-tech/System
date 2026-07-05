import type { SlashCommandContext, TextCommandContext } from 'necord';
import { WarnRemoveDto } from './../dto/warn_remove.dto';
import { Repository } from 'typeorm';
import { Warning } from 'src/database/entities/warning.entity';
export declare class WarnRemoveCommand {
    private readonly warnRepository;
    constructor(warnRepository: Repository<Warning>);
    onWarnRemoveSlash([interaction]: SlashCommandContext, { input }: WarnRemoveDto): Promise<any>;
    onWarnRemovePrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private processWarnRemoval;
}
