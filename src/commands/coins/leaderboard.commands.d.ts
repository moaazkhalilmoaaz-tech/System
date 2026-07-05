import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Repository } from 'typeorm';
import { NecordPaginationService } from '@necord/pagination';
import { Credit } from 'src/database/entities/credit.entity';
import { SettingsService } from './../../api/settings/settings.service';
export declare class LeaderboardCommand {
    private readonly creditRepository;
    private readonly paginationService;
    private readonly settingService;
    constructor(creditRepository: Repository<Credit>, paginationService: NecordPaginationService, settingService: SettingsService);
    onSlash([interaction]: [ChatInputCommandInteraction]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    onText([message]: [Message]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | import("discord.js").InteractionResponse<boolean> | undefined>;
    private handleLeaderboard;
}
