import { GuildsService } from './guilds.service';
export declare class GuildsController {
    private readonly guildsService;
    constructor(guildsService: GuildsService);
    getAllGuilds(): {
        id: string;
        name: string;
        icon: string | null;
        memberCount: number;
    }[];
}
