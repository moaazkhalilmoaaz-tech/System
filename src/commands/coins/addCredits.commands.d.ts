import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Repository } from 'typeorm';
import { Credit } from 'src/database/entities/credit.entity';
import { AddCreditsDto } from './../dto/addCredits.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class AddCreditsCommand {
    private readonly creditRepository;
    private readonly settingService;
    constructor(creditRepository: Repository<Credit>, settingService: SettingsService);
    onAddCredits([interaction]: [ChatInputCommandInteraction], { user, amount }: AddCreditsDto): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    onTextAddCredits([message]: [Message], args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    private execute;
    private checkPermission;
}
