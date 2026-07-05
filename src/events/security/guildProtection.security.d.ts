import { Client } from 'discord.js';
export declare class GuildProtectionService {
    private readonly client;
    private readonly logger;
    private readonly ALLOWED_GUILDS_IDS;
    constructor(client: Client);
    onGuildJoin([guild]: [any]): Promise<void>;
    onReady(): void;
}
