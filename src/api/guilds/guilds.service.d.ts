import { Client } from 'discord.js';
export declare class GuildsService {
    private readonly client;
    constructor(client: Client);
    getBotGuilds(): {
        id: string;
        name: string;
        icon: string | null;
        memberCount: number;
    }[];
}
