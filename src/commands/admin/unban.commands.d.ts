import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { UnBanDto } from '../dto/unban.dto';
import { SettingsService } from './../../api/settings/settings.service';
import { Repository } from 'typeorm';
import { Ban } from '../../database/entities/ban.entity';
export declare class UnbanCommand {
    private readonly client;
    private readonly settingService;
    private readonly banRepository;
    constructor(client: Client, settingService: SettingsService, banRepository: Repository<Ban>);
    onUnbanSlash([interaction]: SlashCommandContext, { user, reason }: UnBanDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onUnbanPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
