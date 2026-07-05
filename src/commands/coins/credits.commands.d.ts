import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Repository } from 'typeorm';
import { CreditsDto } from './../dto/credits.dto';
import { Credit } from 'src/database/entities/credit.entity';
import { SettingsService } from './../../api/settings/settings.service';
export declare class CreditsCommand {
    private readonly creditRepository;
    private readonly settingService;
    constructor(creditRepository: Repository<Credit>, settingService: SettingsService);
    onSlash([interaction]: [ChatInputCommandInteraction], { user, amount }: CreditsDto): Promise<Message<boolean> | import("discord.js").InteractionCallbackResponse<boolean> | import("discord.js").InteractionResponse<boolean> | undefined>;
    onText([message]: [Message], args: string[]): Promise<Message<boolean> | import("discord.js").InteractionCallbackResponse<boolean> | undefined>;
    private generateCaptcha;
    private handleTransferRequest;
    private finalizeTransfer;
    private getUserBalance;
    private reply;
    private isNotAllowed;
}
