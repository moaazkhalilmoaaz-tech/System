import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Repository } from 'typeorm';
import { Credit } from 'src/database/entities/credit.entity';
import { RemoveCreditsDto } from './../dto/removeCredits.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class RemoveCreditsCommand {
    private readonly creditRepository;
    private readonly settingService;
    constructor(creditRepository: Repository<Credit>, settingService: SettingsService);
    onRemoveCredits([interaction]: [ChatInputCommandInteraction], { user, amount }: RemoveCreditsDto): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    onTextRemoveCredits([message]: [Message], args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    private execute;
    private checkPermission;
}
