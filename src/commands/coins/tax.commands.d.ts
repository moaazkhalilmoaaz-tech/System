import { ChatInputCommandInteraction, Message } from 'discord.js';
import { TaxDto } from './../dto/tax.dto';
import { SettingsService } from './../../api/settings/settings.service';
export declare class TaxCommand {
    private readonly settingService;
    constructor(settingService: SettingsService);
    private parseAmount;
    onSlashTax([interaction]: [ChatInputCommandInteraction], { amount }: TaxDto): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    onTextTax([message]: [Message], args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    private calculateAndReply;
}
