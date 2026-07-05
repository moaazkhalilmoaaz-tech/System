import { Repository } from 'typeorm';
import { Ban } from '../../database/entities/ban.entity';
import { Client } from 'discord.js';
export declare class BanCleanupService {
    private readonly client;
    private readonly banRepository;
    private readonly logger;
    constructor(client: Client, banRepository: Repository<Ban>);
    handleUnban(): Promise<void>;
}
