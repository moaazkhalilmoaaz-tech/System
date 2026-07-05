import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { Repository } from 'typeorm';
import { Ban } from '../../database/entities/ban.entity';
import { SettingsService } from '../../api/settings/settings.service';
import { BanDto } from '../dto/ban.dto';
export declare class BanCommand {
    private readonly client;
    private readonly banRepository;
    private readonly settingsService;
    constructor(client: Client, banRepository: Repository<Ban>, settingsService: SettingsService);
    onBanSlash([interaction]: SlashCommandContext, options: BanDto): Promise<any>;
    onBanPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private parseTimeString;
    private processBan;
    private showReasonMenu;
    private executeBan;
}
